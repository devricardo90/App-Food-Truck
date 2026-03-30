import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'cmenuitem_123' })
  menuItemId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  quantity!: number;

  @ApiPropertyOptional({ example: 'Sem cebola roxa', maxLength: 280 })
  note?: string;
}

export class CreateOrderRequestDto {
  @ApiProperty({ example: 'funky-chicken' })
  foodtruckSlug!: string;

  @ApiPropertyOptional({
    example: 'Retirar proximo ao palco principal',
    maxLength: 500,
  })
  specialInstructions?: string;

  @ApiProperty({
    type: CreateOrderItemDto,
    isArray: true,
    minItems: 1,
  })
  items!: CreateOrderItemDto[];
}

export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    example: 'in_progress',
    description:
      'Target operational status for the order within the foodtruck workflow.',
  })
  targetStatus!: string;

  @ApiPropertyOptional({
    example: 'Falha operacional na cozinha',
    maxLength: 500,
    description:
      'Required when cancelling an order from an operational state.',
  })
  reason?: string;
}

export class OrderEventTruckSnapshotDto {
  @ApiProperty({ example: 'ceventtruck_123' })
  id!: string;

  @ApiProperty({ example: 'funky-chicken' })
  foodtruckSlug!: string;

  @ApiProperty({ example: 'Funky Chicken' })
  foodtruckName!: string;

  @ApiProperty({ example: 'stockholm-street-food-week' })
  eventSlug!: string;
}

export class OrderLineDto {
  @ApiProperty({ example: 'corderitem_123' })
  id!: string;

  @ApiProperty({ example: 'cmenuitem_123', nullable: true })
  menuItemId!: string | null;

  @ApiProperty({ example: 'Triple Cheese Burger 150g' })
  itemName!: string;

  @ApiProperty({ example: '132.00' })
  unitPrice!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: '264.00' })
  lineTotal!: string;

  @ApiPropertyOptional({ example: 'Sem picles' })
  note?: string | null;
}

export class OrderPaymentSnapshotDto {
  @ApiProperty({ example: 'cpayment_123' })
  id!: string;

  @ApiProperty({ example: 'mock_gateway' })
  provider!: string;

  @ApiProperty({ example: 'pending' })
  status!: string;

  @ApiProperty({ example: '264.00' })
  amount!: string;

  @ApiProperty({ example: 'EUR' })
  currency!: string;
}

export class OrderSummaryDto {
  @ApiProperty({ example: 'corder_123' })
  id!: string;

  @ApiProperty({ example: 'ord_kx9s3w7b' })
  publicCode!: string;

  @ApiProperty({ example: 'pending_payment' })
  status!: string;

  @ApiProperty({ example: '132.00' })
  totalAmount!: string;

  @ApiProperty({ example: 'EUR' })
  currency!: string;

  @ApiProperty({ type: OrderEventTruckSnapshotDto })
  eventTruck!: OrderEventTruckSnapshotDto;

  @ApiProperty({ example: '2026-03-30T17:55:12.000Z' })
  createdAt!: string;
}

export class TruckOrderQueueItemDto extends OrderSummaryDto {
  @ApiPropertyOptional({ example: 'Ricardo Dev', nullable: true })
  customerName!: string | null;

  @ApiPropertyOptional({ example: 'cliente@foodtrucks.app', nullable: true })
  customerEmail!: string | null;
}

export class TruckOrderQueueResponseDto {
  @ApiProperty({ type: OrderEventTruckSnapshotDto })
  activeFoodtruck!: OrderEventTruckSnapshotDto;

  @ApiProperty({ example: '2' })
  pendingPaymentCount!: number;

  @ApiProperty({ example: '5' })
  newCount!: number;

  @ApiProperty({ example: '3' })
  inProgressCount!: number;

  @ApiProperty({ example: '1' })
  readyCount!: number;

  @ApiProperty({ type: TruckOrderQueueItemDto, isArray: true })
  orders!: TruckOrderQueueItemDto[];
}

export class OrderResponseDto {
  @ApiProperty({ example: 'corder_123' })
  id!: string;

  @ApiProperty({ example: 'ord_kx9s3w7b' })
  publicCode!: string;

  @ApiProperty({ example: 'pending_payment' })
  status!: string;

  @ApiProperty({ example: '264.00' })
  subtotalAmount!: string;

  @ApiProperty({ example: '264.00' })
  totalAmount!: string;

  @ApiProperty({ example: 'EUR' })
  currency!: string;

  @ApiPropertyOptional({ example: 'Retirar proximo ao palco principal' })
  specialInstructions?: string | null;

  @ApiPropertyOptional({ example: '2026-03-30T18:00:00.000Z', nullable: true })
  capacityWindowStart!: string | null;

  @ApiPropertyOptional({ example: '2026-03-30T18:15:00.000Z', nullable: true })
  capacityWindowEnd!: string | null;

  @ApiProperty({ type: OrderEventTruckSnapshotDto })
  eventTruck!: OrderEventTruckSnapshotDto;

  @ApiProperty({ type: OrderLineDto, isArray: true })
  items!: OrderLineDto[];

  @ApiProperty({ type: OrderPaymentSnapshotDto })
  payment!: OrderPaymentSnapshotDto;

  @ApiProperty({ example: '2026-03-30T17:55:12.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-30T17:55:12.000Z' })
  updatedAt!: string;
}

export class CreatedOrderResponseDto extends PickType(OrderResponseDto, [
  'id',
  'publicCode',
  'status',
  'subtotalAmount',
  'totalAmount',
  'currency',
  'specialInstructions',
  'capacityWindowStart',
  'capacityWindowEnd',
  'eventTruck',
  'items',
  'payment',
  'createdAt',
  'updatedAt',
] as const) {}

export class ConfirmMockPaymentResponseDto extends PickType(OrderResponseDto, [
  'id',
  'publicCode',
  'status',
  'subtotalAmount',
  'totalAmount',
  'currency',
  'specialInstructions',
  'capacityWindowStart',
  'capacityWindowEnd',
  'eventTruck',
  'items',
  'payment',
  'createdAt',
  'updatedAt',
] as const) {}
