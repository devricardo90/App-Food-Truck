import type {
  MembershipRole,
  MembershipStatus,
  UserRole,
} from '../../generated/prisma/enums';

export type AuthMembershipContext = {
  id: string;
  foodtruckId: string;
  foodtruckSlug: string;
  foodtruckName: string;
  role: MembershipRole;
  status: MembershipStatus;
};

export type AuthenticatedRequestUser = {
  userId: string;
  externalAuthId: string;
  role: UserRole;
  email: string | null;
  name: string | null;
  memberships: AuthMembershipContext[];
  tokenSubject: string;
};
