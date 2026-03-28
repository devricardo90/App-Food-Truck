import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserRole } from '../../generated/prisma/enums';
import { CurrentAuthUser } from './current-auth-user.decorator';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';
import type { AuthenticatedRequestUser } from './auth.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
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
    summary: 'Resolve the authenticated user context from Clerk token.',
  })
  @ApiOkResponse({
    description: 'Authenticated user context.',
    schema: {
      example: {
        userId: 'cm0auth123',
        externalAuthId: 'user_123',
        role: 'customer',
        email: 'cliente@foodtrucks.app',
        memberships: [],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Clerk bearer token.',
  })
  getMe(@CurrentAuthUser() authUser: AuthenticatedRequestUser) {
    return authUser;
  }

  @Get('truck-context')
  @Roles(UserRole.truck_operator, UserRole.truck_manager)
  @ApiBearerAuth('clerk')
  @ApiOperation({ summary: 'Example protected route for truck roles.' })
  @ApiForbiddenResponse({ description: 'Authenticated user lacks truck role.' })
  getTruckContext(@CurrentAuthUser() authUser: AuthenticatedRequestUser) {
    return {
      role: authUser.role,
      memberships: authUser.memberships,
    };
  }

  @Get('platform-context')
  @Roles(UserRole.platform_admin)
  @ApiBearerAuth('clerk')
  @ApiOperation({ summary: 'Example protected route for platform admin role.' })
  @ApiForbiddenResponse({
    description: 'Authenticated user lacks platform_admin role.',
  })
  getPlatformContext(@CurrentAuthUser() authUser: AuthenticatedRequestUser) {
    return {
      role: authUser.role,
      memberships: authUser.memberships,
      elevatedScope: 'platform_admin',
    };
  }
}
