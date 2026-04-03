import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MembershipRole } from '../../generated/prisma/enums';
import { CurrentActiveFoodtruck } from '../auth/current-active-foodtruck.decorator';
import { FoodtruckMembership } from '../auth/foodtruck-membership.decorator';
import { CurrentAuthUser } from '../auth/current-auth-user.decorator';
import type {
  AuthMembershipContext,
  AuthenticatedRequestUser,
} from '../auth/auth.types';
import {
  ConfirmMockPaymentResponseDto,
  CreateOrderRequestDto,
  CreatedOrderResponseDto,
  OrderResponseDto,
  OrderSummaryDto,
  TruckOrderQueueResponseDto,
  UpdateOrderStatusRequestDto,
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

  @Get('foodtruck-queue')
  @FoodtruckMembership(
    MembershipRole.truck_operator,
    MembershipRole.truck_manager,
  )
  @ApiHeader({
    name: 'x-foodtruck-id',
    required: false,
    description:
      'Optional active foodtruck id. Required when the authenticated user has multiple foodtruck memberships.',
  })
  @ApiOperation({
    summary: 'List the operational queue for the active foodtruck context.',
  })
  @ApiOkResponse({
    description:
      'Operational queue grouped by status for the active foodtruck.',
    type: TruckOrderQueueResponseDto,
  })
  listFoodtruckQueue(
    @CurrentActiveFoodtruck() activeFoodtruck: AuthMembershipContext,
  ): Promise<TruckOrderQueueResponseDto> {
    return this.ordersService.listOrdersForFoodtruck(activeFoodtruck);
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

  @Post(':orderId/confirm-payment')
  @ApiOperation({
    summary:
      'Confirm the mock payment handoff and promote the order to the operational queue.',
  })
  @ApiOkResponse({
    description:
      'Mock payment confirmed and order promoted from pending_payment to new.',
    type: ConfirmMockPaymentResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Clerk bearer token.',
  })
  @ApiConflictResponse({
    description:
      'Order is no longer pending payment or its payment snapshot cannot be promoted.',
  })
  @ApiNotFoundResponse({
    description: 'Order was not found for the authenticated customer.',
  })
  confirmMockPayment(
    @CurrentAuthUser() authUser: AuthenticatedRequestUser,
    @Param('orderId') orderId: string,
  ): Promise<ConfirmMockPaymentResponseDto> {
    return this.ordersService.confirmMockPayment(authUser, orderId);
  }

  @Patch(':orderId/status')
  @FoodtruckMembership(
    MembershipRole.truck_operator,
    MembershipRole.truck_manager,
  )
  @ApiHeader({
    name: 'x-foodtruck-id',
    required: false,
    description:
      'Optional active foodtruck id. Required when the authenticated user has multiple foodtruck memberships.',
  })
  @ApiOperation({
    summary: 'Advance or cancel an order within the active foodtruck workflow.',
  })
  @ApiOkResponse({
    description: 'Order status updated with operational audit trail.',
    type: OrderResponseDto,
  })
  @ApiConflictResponse({
    description: 'The requested status transition is not allowed.',
  })
  @ApiNotFoundResponse({
    description:
      'Order was not found for the active foodtruck operational context.',
  })
  updateOrderStatus(
    @CurrentActiveFoodtruck() activeFoodtruck: AuthMembershipContext,
    @Param('orderId') orderId: string,
    @Body() payload: UpdateOrderStatusRequestDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateOrderStatus(
      activeFoodtruck,
      orderId,
      payload,
    );
  }

  @Get(':orderId')
  @ApiOperation({
    summary:
      'Resolve a pending or active order for the authenticated customer.',
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
