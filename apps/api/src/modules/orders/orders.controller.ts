import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentAuthUser } from '../auth/current-auth-user.decorator';
import type { AuthenticatedRequestUser } from '../auth/auth.types';
import {
  CreateOrderRequestDto,
  CreatedOrderResponseDto,
  OrderResponseDto,
  OrderSummaryDto,
} from './orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth('clerk')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'List the authenticated customer orders ordered by most recent.',
  })
  @ApiOkResponse({
    description: 'Authenticated order history for the current customer.',
    type: OrderSummaryDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Clerk bearer token.',
  })
  listOrders(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
  ): Promise<OrderSummaryDto[]> {
    return this.ordersService.listOrdersForCustomer(authUser);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a pending payment order for the authenticated customer.',
  })
  @ApiCreatedResponse({
    description:
      'Pending payment order created with item snapshots and initial payment record.',
    type: CreatedOrderResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Clerk bearer token.',
  })
  @ApiNotFoundResponse({
    description: 'Foodtruck or menu item was not found in the active event.',
  })
  @ApiConflictResponse({
    description:
      'Foodtruck is not accepting orders or one of the items is unavailable.',
  })
  createOrder(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
    @Body() payload: CreateOrderRequestDto,
  ): Promise<CreatedOrderResponseDto> {
    return this.ordersService.createPendingOrder(authUser, payload);
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'Resolve a pending or active order for the authenticated customer.',
  })
  @ApiOkResponse({
    description: 'Order detail resolved for the authenticated customer.',
    type: OrderResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Clerk bearer token.',
  })
  @ApiNotFoundResponse({
    description: 'Order was not found for the authenticated customer.',
  })
  getOrderById(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
    @Param('orderId') orderId: string,
  ): Promise<OrderResponseDto> {
    return this.ordersService.getOrderById(authUser, orderId);
  }
}
