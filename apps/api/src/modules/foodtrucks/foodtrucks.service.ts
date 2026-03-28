import { Injectable, NotFoundException } from '@nestjs/common';

import { EventStatus, TruckStatus } from '../../generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  FoodtruckCatalogResponseDto,
  FoodtruckDetailDto,
  FoodtruckListItemDto,
} from './foodtrucks.dto';
import {
  getDevelopmentFoodtruckCatalog,
  getDevelopmentFoodtruckDetail,
  listDevelopmentFoodtrucks,
} from './dev-foodtrucks.data';

@Injectable()
export class FoodtrucksService {
  constructor(private readonly prisma: PrismaService) {}

  async listActiveFoodtrucks(): Promise<FoodtruckListItemDto[]> {
    const activeEvent = await this.findActiveEvent();

    if (!activeEvent) {
      return listDevelopmentFoodtrucks();
    }
    const eventTrucks = await this.prisma.eventTruck.findMany({
      where: {
        eventId: activeEvent.id,
        truck: {
          status: TruckStatus.active,
        },
      },
      select: {
        displayName: true,
        acceptsOrders: true,
        capacityWindowMinutes: true,
        maxOrdersPerWindow: true,
        truck: {
          select: {
            slug: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [{ acceptsOrders: 'desc' }, { truck: { name: 'asc' } }],
    });

    return eventTrucks.map((eventTruck) => ({
      slug: eventTruck.truck.slug,
      name: eventTruck.truck.name,
      description: eventTruck.truck.description,
      displayName: eventTruck.displayName ?? eventTruck.truck.name,
      acceptsOrders: eventTruck.acceptsOrders,
      capacityWindowMinutes: eventTruck.capacityWindowMinutes,
      maxOrdersPerWindow: eventTruck.maxOrdersPerWindow,
      primaryCategory: null,
      instagram: null,
      whatsapp: null,
      heroImageKey: null,
    }));
  }

  async getFoodtruckDetail(foodtruckSlug: string): Promise<FoodtruckDetailDto> {
    const developmentDetail = getDevelopmentFoodtruckDetail(foodtruckSlug);

    if (developmentDetail) {
      return developmentDetail;
    }

    const activeEvent = await this.findActiveEventOrThrow();
    const eventTruck = await this.findActiveEventTruckOrThrow(foodtruckSlug);

    return {
      slug: eventTruck.truck.slug,
      name: eventTruck.truck.name,
      description: eventTruck.truck.description,
      displayName: eventTruck.displayName ?? eventTruck.truck.name,
      acceptsOrders: eventTruck.acceptsOrders,
      capacityWindowMinutes: eventTruck.capacityWindowMinutes,
      maxOrdersPerWindow: eventTruck.maxOrdersPerWindow,
      eventSlug: activeEvent.slug,
      eventName: activeEvent.name,
      primaryCategory: null,
      instagram: null,
      whatsapp: null,
      heroImageKey: null,
      logoImageKey: null,
      operatingDays: null,
      openingTime: null,
      closingTime: null,
    };
  }

  async getFoodtruckCatalog(
    foodtruckSlug: string,
  ): Promise<FoodtruckCatalogResponseDto> {
    const developmentCatalog = getDevelopmentFoodtruckCatalog(foodtruckSlug);

    if (developmentCatalog) {
      return developmentCatalog;
    }

    const activeEvent = await this.findActiveEventOrThrow();
    const eventTruck = await this.findActiveEventTruckOrThrow(foodtruckSlug);

    return {
      foodtruckSlug: eventTruck.truck.slug,
      foodtruckName: eventTruck.truck.name,
      eventSlug: activeEvent.slug,
      categories: eventTruck.categories.map((category) => ({
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
        items: category.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price.toString(),
          currency: 'EUR',
          isAvailable: item.isAvailable,
          dailyStockRemaining: item.dailyStockRemaining,
          sortOrder: item.sortOrder,
          imageKey: null,
        })),
      })),
    };
  }

  private async findActiveEvent() {
    try {
      return await this.prisma.event.findFirst({
        where: {
          status: EventStatus.active,
        },
        orderBy: {
          startsAt: 'asc',
        },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      });
    } catch (error) {
      if (this.shouldUseDevelopmentFallback(error)) {
        return null;
      }

      throw error;
    }
  }

  private shouldUseDevelopmentFallback(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === 'P1001' || error.code === 'P2021')
    );
  }

  private async findActiveEventOrThrow() {
    const activeEvent = await this.findActiveEvent();

    if (!activeEvent) {
      throw new NotFoundException(
        'No active event is available for public foodtruck discovery.',
      );
    }

    return activeEvent;
  }

  private async findActiveEventTruckOrThrow(foodtruckSlug: string) {
    const activeEvent = await this.findActiveEventOrThrow();
    const eventTruck = await this.prisma.eventTruck.findFirst({
      where: {
        eventId: activeEvent.id,
        truck: {
          slug: foodtruckSlug,
          status: TruckStatus.active,
        },
      },
      select: {
        displayName: true,
        acceptsOrders: true,
        capacityWindowMinutes: true,
        maxOrdersPerWindow: true,
        truck: {
          select: {
            slug: true,
            name: true,
            description: true,
          },
        },
        categories: {
          select: {
            slug: true,
            name: true,
            sortOrder: true,
            items: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                isAvailable: true,
                dailyStockRemaining: true,
                sortOrder: true,
              },
              orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            },
          },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
    });

    if (!eventTruck) {
      throw new NotFoundException(
        `Foodtruck '${foodtruckSlug}' is not available in the active event.`,
      );
    }

    return eventTruck;
  }
}
