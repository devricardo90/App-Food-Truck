import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EventStatus, OrderActorType, OrderStatus, PaymentStatus } from '../../generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AuthMembershipContext,
  AuthenticatedRequestUser,
} from '../auth/auth.types';
import type {
  CreateOrderRequestDto,
  CreatedOrderResponseDto,
  OrderResponseDto,
  OrderSummaryDto,
  TruckOrderQueueResponseDto,
  UpdateOrderStatusRequestDto,
} from './orders.dto';

const TRUCK_OPERATIONAL_TRANSITIONS: Record<
  OrderStatus,
  ReadonlyArray<OrderStatus>
> = {
  [OrderStatus.pending_payment]: [],
  [OrderStatus.new]: [OrderStatus.in_progress, OrderStatus.cancelled],
  [OrderStatus.in_progress]: [OrderStatus.ready, OrderStatus.cancelled],
  [OrderStatus.ready]: [OrderStatus.completed, OrderStatus.cancelled],
  [OrderStatus.completed]: [],
  [OrderStatus.cancelled]: [],
};

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

  async confirmMockPayment(
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

    const payment = order.payments[0];

    if (!payment) {
      throw new NotFoundException(
        `Order '${orderId}' does not have a payment snapshot to confirm.`,
      );
    }

    if (order.status !== OrderStatus.pending_payment) {
      throw new ConflictException(
        `Order '${orderId}' is already in '${order.status}' and cannot be confirmed again.`,
      );
    }

    if (payment.status !== PaymentStatus.pending) {
      throw new ConflictException(
        `Payment '${payment.id}' is already in '${payment.status}' and cannot be confirmed again.`,
      );
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PaymentStatus.paid,
          paidAt: new Date(),
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: OrderStatus.new,
          actorType: OrderActorType.payment_provider,
          reason: 'Mock payment confirmed and order promoted to the truck queue.',
        },
      });

      return tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.new,
        },
        include: this.getOrderInclude(),
      });
    });

    return this.mapOrder(updatedOrder);
  }

  async listOrdersForCustomer(
    authUser: AuthenticatedRequestUser,
  ): Promise<OrderSummaryDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        customerId: authUser.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
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
        payments: {
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
    });

    return orders.map((order) => this.mapOrderSummary(order));
  }

  async listOrdersForFoodtruck(
    activeFoodtruck: AuthMembershipContext,
  ): Promise<TruckOrderQueueResponseDto> {
    const orders = await this.prisma.order.findMany({
      where: {
        eventTruck: {
          truckId: activeFoodtruck.foodtruckId,
        },
        status: {
          in: [
            OrderStatus.pending_payment,
            OrderStatus.new,
            OrderStatus.in_progress,
            OrderStatus.ready,
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
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
        payments: {
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
    });

    return {
      activeFoodtruck: {
        id: activeFoodtruck.foodtruckId,
        foodtruckSlug: activeFoodtruck.foodtruckSlug,
        foodtruckName: activeFoodtruck.foodtruckName,
        eventSlug: orders[0]?.eventTruck.event.slug ?? 'sem-evento',
      },
      pendingPaymentCount: orders.filter(
        (order) => order.status === OrderStatus.pending_payment,
      ).length,
      newCount: orders.filter((order) => order.status === OrderStatus.new).length,
      inProgressCount: orders.filter(
        (order) => order.status === OrderStatus.in_progress,
      ).length,
      readyCount: orders.filter((order) => order.status === OrderStatus.ready)
        .length,
      orders: orders.map((order) => ({
        ...this.mapOrderSummary(order),
        customerName: order.customer.name,
        customerEmail: order.customer.email,
      })),
    };
  }

  async updateOrderStatus(
    activeFoodtruck: AuthMembershipContext,
    orderId: string,
    payload: UpdateOrderStatusRequestDto,
  ): Promise<OrderResponseDto> {
    const targetStatus = this.normalizeTargetStatus(payload.targetStatus);
    const reason = payload.reason?.trim() || null;

    if (targetStatus === OrderStatus.cancelled && !reason) {
      throw new BadRequestException(
        'A cancellation reason is required for operational order cancellation.',
      );
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        eventTruck: {
          truckId: activeFoodtruck.foodtruckId,
        },
      },
      include: this.getOrderInclude(),
    });

    if (!order) {
      throw new NotFoundException(
        `Order '${orderId}' was not found for the active foodtruck context.`,
      );
    }

    const allowedTransitions = TRUCK_OPERATIONAL_TRANSITIONS[order.status];

    if (!allowedTransitions.includes(targetStatus)) {
      throw new ConflictException(
        `Transition '${order.status}' -> '${targetStatus}' is not allowed for truck operations.`,
      );
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: targetStatus,
          actorType:
            activeFoodtruck.role === 'truck_manager'
              ? OrderActorType.truck_manager
              : OrderActorType.truck_operator,
          reason,
        },
      });

      return tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: targetStatus,
          cancelledReason:
            targetStatus === OrderStatus.cancelled ? reason : null,
        },
        include: this.getOrderInclude(),
      });
    });

    return this.mapOrder(updatedOrder);
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

  private mapOrderSummary(
    order: Prisma.OrderGetPayload<{
      include: {
        eventTruck: {
          select: {
            id: true;
            truck: {
              select: {
                slug: true;
                name: true;
              };
            };
            event: {
              select: {
                slug: true;
              };
            };
          };
        };
        payments: {
          orderBy: {
            createdAt: 'asc';
          };
          take: 1;
        };
      };
    }>,
  ): OrderSummaryDto {
    const payment = order.payments[0];

    return {
      id: order.id,
      publicCode: order.publicCode,
      status: order.status,
      totalAmount: order.totalAmount.toString(),
      currency: payment?.currency ?? 'EUR',
      eventTruck: {
        id: order.eventTruck.id,
        foodtruckSlug: order.eventTruck.truck.slug,
        foodtruckName: order.eventTruck.truck.name,
        eventSlug: order.eventTruck.event.slug,
      },
      createdAt: order.createdAt.toISOString(),
    };
  }

  private normalizeTargetStatus(rawStatus: string): OrderStatus {
    const normalized = rawStatus.trim().toLowerCase();

    switch (normalized) {
      case OrderStatus.in_progress:
        return OrderStatus.in_progress;
      case OrderStatus.ready:
        return OrderStatus.ready;
      case OrderStatus.completed:
        return OrderStatus.completed;
      case OrderStatus.cancelled:
        return OrderStatus.cancelled;
      default:
        throw new BadRequestException(
          `Unsupported target status '${rawStatus}' for truck operations.`,
        );
    }
  }
}
