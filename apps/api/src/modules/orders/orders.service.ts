import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EventStatus, OrderActorType, OrderStatus, PaymentStatus } from '../../generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedRequestUser } from '../auth/auth.types';
import type {
  CreateOrderRequestDto,
  CreatedOrderResponseDto,
  OrderResponseDto,
} from './orders.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPendingOrder(
    authUser: AuthenticatedRequestUser,
    payload: CreateOrderRequestDto,
  ): Promise<CreatedOrderResponseDto> {
    const normalizedSlug = payload.foodtruckSlug.trim().toLowerCase();
    const eventTruck = await this.prisma.eventTruck.findFirst({
      where: {
        truck: {
          slug: normalizedSlug,
        },
        event: {
          status: EventStatus.active,
        },
      },
      select: {
        id: true,
        acceptsOrders: true,
        capacityWindowMinutes: true,
        truck: {
          select: {
            slug: true,
            name: true,
          },
        },
        event: {
          select: {
            slug: true,
          },
        },
        items: {
          where: {
            id: {
              in: payload.items.map((item) => item.menuItemId),
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            isAvailable: true,
            dailyStockRemaining: true,
          },
        },
      },
    });

    if (!eventTruck) {
      throw new NotFoundException(
        `Foodtruck '${payload.foodtruckSlug}' is not available in the active event.`,
      );
    }

    if (!eventTruck.acceptsOrders) {
      throw new ConflictException(
        `Foodtruck '${payload.foodtruckSlug}' is not accepting orders right now.`,
      );
    }

    const menuItemsById = new Map(
      eventTruck.items.map((item) => [item.id, item] as const),
    );

    const normalizedItems = payload.items.map((item) => {
      const menuItem = menuItemsById.get(item.menuItemId);

      if (!menuItem) {
        throw new NotFoundException(
          `Menu item '${item.menuItemId}' is not available for foodtruck '${payload.foodtruckSlug}'.`,
        );
      }

      if (!menuItem.isAvailable) {
        throw new ConflictException(
          `Menu item '${menuItem.name}' is currently unavailable for ordering.`,
        );
      }

      if (
        menuItem.dailyStockRemaining !== null &&
        menuItem.dailyStockRemaining < item.quantity
      ) {
        throw new ConflictException(
          `Menu item '${menuItem.name}' does not have enough daily stock remaining.`,
        );
      }

      return {
        menuItem,
        quantity: item.quantity,
        note: item.note?.trim() || null,
      };
    });

    const subtotalAmount = normalizedItems.reduce(
      (total, entry) => total + Number(entry.menuItem.price) * entry.quantity,
      0,
    );

    if (subtotalAmount <= 0) {
      throw new BadRequestException(
        'The checkout payload must contain at least one priced item.',
      );
    }

    const now = new Date();
    const windowMinutes = Math.max(eventTruck.capacityWindowMinutes, 1);
    const windowStart = new Date(now);
    windowStart.setSeconds(0, 0);
    const roundedMinute =
      Math.floor(windowStart.getMinutes() / windowMinutes) * windowMinutes;
    windowStart.setMinutes(roundedMinute, 0, 0);
    const windowEnd = new Date(windowStart.getTime() + windowMinutes * 60_000);

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerId: authUser.userId,
          eventTruckId: eventTruck.id,
          status: OrderStatus.pending_payment,
          subtotalAmount,
          totalAmount: subtotalAmount,
          specialInstructions: payload.specialInstructions?.trim() || null,
          capacityWindowStart: windowStart,
          capacityWindowEnd: windowEnd,
          items: {
            create: normalizedItems.map((entry) => ({
              menuItemId: entry.menuItem.id,
              itemNameSnapshot: entry.menuItem.name,
              unitPriceSnapshot: entry.menuItem.price,
              quantity: entry.quantity,
              note: entry.note,
            })),
          },
          payments: {
            create: {
              provider: 'mock_gateway',
              status: PaymentStatus.pending,
              amount: subtotalAmount,
              currency: 'EUR',
            },
          },
          statusHistory: {
            create: {
              fromStatus: null,
              toStatus: OrderStatus.pending_payment,
              actorType: OrderActorType.customer,
              actorUserId: authUser.userId,
              reason: 'Initial pending payment checkout created by mobile client.',
            },
          },
        },
        include: this.getOrderInclude(),
      });

      return createdOrder;
    });

    return this.mapOrder(order);
  }

  async getOrderById(
    authUser: AuthenticatedRequestUser,
    orderId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: authUser.userId,
      },
      include: this.getOrderInclude(),
    });

    if (!order) {
      throw new NotFoundException(
        `Order '${orderId}' was not found for the authenticated user.`,
      );
    }

    return this.mapOrder(order);
  }

  private getOrderInclude() {
    return {
      eventTruck: {
        select: {
          id: true,
          truck: {
            select: {
              slug: true,
              name: true,
            },
          },
          event: {
            select: {
              slug: true,
            },
          },
        },
      },
      items: {
        orderBy: {
          createdAt: 'asc' as const,
        },
      },
      payments: {
        orderBy: {
          createdAt: 'asc' as const,
        },
        take: 1,
      },
    };
  }

  private mapOrder(
    order: Prisma.OrderGetPayload<{
      include: ReturnType<OrdersService['getOrderInclude']>;
    }>,
  ): OrderResponseDto {
    const payment = order.payments[0];

    if (!payment) {
      throw new NotFoundException(
        `Order '${order.id}' does not have an initial payment snapshot.`,
      );
    }

    return {
      id: order.id,
      publicCode: order.publicCode,
      status: order.status,
      subtotalAmount: order.subtotalAmount.toString(),
      totalAmount: order.totalAmount.toString(),
      currency: payment?.currency ?? 'EUR',
      specialInstructions: order.specialInstructions,
      capacityWindowStart: order.capacityWindowStart?.toISOString() ?? null,
      capacityWindowEnd: order.capacityWindowEnd?.toISOString() ?? null,
      eventTruck: {
        id: order.eventTruck.id,
        foodtruckSlug: order.eventTruck.truck.slug,
        foodtruckName: order.eventTruck.truck.name,
        eventSlug: order.eventTruck.event.slug,
      },
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        itemName: item.itemNameSnapshot,
        unitPrice: item.unitPriceSnapshot.toString(),
        quantity: item.quantity,
        lineTotal: (Number(item.unitPriceSnapshot) * item.quantity).toFixed(2),
        note: item.note,
      })),
      payment: {
        id: payment.id,
        provider: payment.provider,
        status: payment.status,
        amount: payment.amount.toString(),
        currency: payment.currency,
      },
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
