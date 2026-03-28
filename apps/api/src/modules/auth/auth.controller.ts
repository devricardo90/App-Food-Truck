import { Controller, Get, Headers } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MembershipRole, UserRole } from '../../generated/prisma/enums';
import {
  AuthMeResponseDto,
  FoodtruckContextResponseDto,
  PlatformContextResponseDto,
} from './auth.dto';
import { CurrentActiveFoodtruck } from './current-active-foodtruck.decorator';
import { CurrentAuthUser } from './current-auth-user.decorator';
import { FoodtruckMembership } from './foodtruck-membership.decorator';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import type {
  AuthMembershipContext,
  AuthenticatedRequestUser,
} from './auth.types';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Return a public auth module heartbeat.' })
  @ApiOkResponse({
    description: 'Public auth route is reachable without token.',
    schema: {
      example: {
        status: 'ok',
        scope: 'public',
      },
    },
  })
  getPublicHeartbeat() {
    return {
      status: 'ok',
      scope: 'public',
    };
  }

  @Get('me')
  @ApiBearerAuth('clerk')
  @ApiOperation({
    summary: 'Resolve the authenticated user and active foodtruck context.',
  })
  @ApiHeader({
    name: 'x-foodtruck-id',
    required: false,
    description:
      'Optional active foodtruck id. Required only when the user has multiple memberships and wants a specific context.',
  })
  @ApiOkResponse({
    description: 'Authenticated user context with stable foodtruck contract.',
    type: AuthMeResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Clerk bearer token.',
  })
  @ApiForbiddenResponse({
    description:
      'Requested foodtruck does not belong to the authenticated user.',
  })
  getMe(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
    @Headers('x-foodtruck-id') requestedFoodtruckId?: string,
  ): AuthMeResponseDto {
    return this.authService.buildMeContext(authUser, requestedFoodtruckId);
  }

  @Get('foodtruck-context')
  @FoodtruckMembership(
    MembershipRole.truck_operator,
    MembershipRole.truck_manager,
  )
  @ApiBearerAuth('clerk')
  @ApiHeader({
    name: 'x-foodtruck-id',
    required: false,
    description:
      'Optional active foodtruck id. Required when the authenticated user has multiple foodtruck memberships.',
  })
  @ApiOperation({
    summary: 'Resolve the operational context of the active foodtruck.',
  })
  @ApiOkResponse({
    description: 'Resolved active foodtruck context for the current user.',
    type: FoodtruckContextResponseDto,
  })
  @ApiForbiddenResponse({
    description:
      'Authenticated user lacks the required foodtruck membership or selection.',
  })
  getFoodtruckContext(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
    @CurrentActiveFoodtruck() activeFoodtruck: AuthMembershipContext,
  ): FoodtruckContextResponseDto {
    return {
      activeFoodtruck,
      memberships: authUser.memberships,
    };
  }

  @Get('platform-context')
  @Roles(UserRole.platform_admin)
  @ApiBearerAuth('clerk')
  @ApiOperation({ summary: 'Example protected route for platform admin role.' })
  @ApiOkResponse({
    description: 'Resolved platform context for admin users.',
    type: PlatformContextResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Authenticated user lacks platform_admin role.',
  })
  getPlatformContext(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
  ): PlatformContextResponseDto {
    return {
      role: authUser.role,
      canAccessPlatform: true,
      memberships: authUser.memberships,
      elevatedScope: 'platform_admin',
    };
  }
}
