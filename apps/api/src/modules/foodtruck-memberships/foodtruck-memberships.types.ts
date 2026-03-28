import type {
  MembershipRole,
  MembershipStatus,
} from '../../generated/prisma/enums';

export type FoodtruckMembershipSummary = {
  id: string;
  foodtruckId: string;
  foodtruckSlug: string;
  foodtruckName: string;
  role: MembershipRole;
  status: MembershipStatus;
};
