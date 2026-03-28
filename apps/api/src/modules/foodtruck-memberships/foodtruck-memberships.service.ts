import { Injectable } from '@nestjs/common';

import { MembershipStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { FoodtruckMembershipSummary } from './foodtruck-memberships.types';

@Injectable()
export class FoodtruckMembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async listActiveForUser(
    userId: string,
  ): Promise<FoodtruckMembershipSummary[]> {
    const memberships = await this.prisma.truckMembership.findMany({
      where: {
        userId,
        status: MembershipStatus.active,
      },
      select: {
        id: true,
        role: true,
        status: true,
        truck: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
      orderBy: [{ role: 'asc' }, { truck: { name: 'asc' } }],
    });

    return memberships.map((membership) => ({
      id: membership.id,
      foodtruckId: membership.truck.id,
      foodtruckSlug: membership.truck.slug,
      foodtruckName: membership.truck.name,
      role: membership.role,
      status: membership.status,
    }));
  }
}
