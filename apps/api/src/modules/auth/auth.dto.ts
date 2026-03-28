import { ApiProperty } from '@nestjs/swagger';

import {
  MembershipRole,
  MembershipStatus,
  UserRole,
} from '../../generated/prisma/enums';

export class AuthFoodtruckMembershipDto {
  @ApiProperty({ example: 'cmembership_123' })
  id!: string;

  @ApiProperty({ example: 'cfoodtruck_123' })
  foodtruckId!: string;

  @ApiProperty({ example: 'burger-do-evento' })
  foodtruckSlug!: string;

  @ApiProperty({ example: 'Burger do Evento' })
  foodtruckName!: string;

  @ApiProperty({ enum: MembershipRole, example: MembershipRole.truck_manager })
  role!: MembershipRole;

  @ApiProperty({ enum: MembershipStatus, example: MembershipStatus.active })
  status!: MembershipStatus;
}

export class AuthMeResponseDto {
  @ApiProperty({ example: 'cuser_123' })
  userId!: string;

  @ApiProperty({ example: 'user_2abc123' })
  externalAuthId!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.customer })
  role!: UserRole;

  @ApiProperty({ example: 'owner@foodtrucks.app', nullable: true })
  email!: string | null;

  @ApiProperty({ example: 'Foodtruck Owner', nullable: true })
  name!: string | null;

  @ApiProperty({ example: true })
  canAccessPlatform!: boolean;

  @ApiProperty({ example: false })
  requiresFoodtruckSelection!: boolean;

  @ApiProperty({
    type: () => AuthFoodtruckMembershipDto,
    isArray: true,
  })
  memberships!: AuthFoodtruckMembershipDto[];

  @ApiProperty({
    type: () => AuthFoodtruckMembershipDto,
    nullable: true,
  })
  activeFoodtruck!: AuthFoodtruckMembershipDto | null;
}

export class FoodtruckContextResponseDto {
  @ApiProperty({
    type: () => AuthFoodtruckMembershipDto,
  })
  activeFoodtruck!: AuthFoodtruckMembershipDto;

  @ApiProperty({
    type: () => AuthFoodtruckMembershipDto,
    isArray: true,
  })
  memberships!: AuthFoodtruckMembershipDto[];
}

export class PlatformContextResponseDto {
  @ApiProperty({ enum: UserRole, example: UserRole.platform_admin })
  role!: UserRole;

  @ApiProperty({ example: true })
  canAccessPlatform!: boolean;

  @ApiProperty({
    type: () => AuthFoodtruckMembershipDto,
    isArray: true,
  })
  memberships!: AuthFoodtruckMembershipDto[];

  @ApiProperty({ example: 'platform_admin' })
  elevatedScope!: string;
}
