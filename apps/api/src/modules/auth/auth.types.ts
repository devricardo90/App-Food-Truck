import type { MembershipRole, UserRole } from '../../generated/prisma/enums';

export type AuthMembershipContext = {
  truckId: string;
  role: MembershipRole;
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
