import { SetMetadata } from '@nestjs/common';

import type { MembershipRole } from '../../generated/prisma/enums';

export const FOODTRUCK_MEMBERSHIP_ROLES_KEY = 'foodtruckMembershipRoles';

export const FoodtruckMembership = (...roles: MembershipRole[]) =>
  SetMetadata(FOODTRUCK_MEMBERSHIP_ROLES_KEY, roles);
