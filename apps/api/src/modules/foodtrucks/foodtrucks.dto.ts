import { ApiProperty } from '@nestjs/swagger';

export class FoodtruckListItemDto {
  @ApiProperty({ example: 'smoke-house' })
  slug!: string;

  @ApiProperty({ example: 'Smoke House' })
  name!: string;

  @ApiProperty({ example: 'Burgers artesanais e fila rapida para retirada.' })
  description!: string | null;

  @ApiProperty({ example: 'Smoke House @ Spring Festival' })
  displayName!: string;

  @ApiProperty({ example: true })
  acceptsOrders!: boolean;

  @ApiProperty({ example: 15 })
  capacityWindowMinutes!: number;

  @ApiProperty({ example: 12 })
  maxOrdersPerWindow!: number;
}

export class FoodtruckDetailDto extends FoodtruckListItemDto {
  @ApiProperty({ example: 'spring-festival-2026' })
  eventSlug!: string;

  @ApiProperty({ example: 'Spring Festival 2026' })
  eventName!: string;
}

export class FoodtruckCatalogItemDto {
  @ApiProperty({ example: 'classic-burger' })
  id!: string;

  @ApiProperty({ example: 'Classic Burger' })
  name!: string;

  @ApiProperty({ example: 'Pao brioche, smash burger e cheddar.' })
  description!: string | null;

  @ApiProperty({ example: '11.00' })
  price!: string;

  @ApiProperty({ example: true })
  isAvailable!: boolean;

  @ApiProperty({ example: 10, nullable: true })
  dailyStockRemaining!: number | null;

  @ApiProperty({ example: 0 })
  sortOrder!: number;
}

export class FoodtruckCatalogCategoryDto {
  @ApiProperty({ example: 'burgers' })
  slug!: string;

  @ApiProperty({ example: 'Burgers' })
  name!: string;

  @ApiProperty({ example: 0 })
  sortOrder!: number;

  @ApiProperty({
    type: () => FoodtruckCatalogItemDto,
    isArray: true,
  })
  items!: FoodtruckCatalogItemDto[];
}

export class FoodtruckCatalogResponseDto {
  @ApiProperty({ example: 'smoke-house' })
  foodtruckSlug!: string;

  @ApiProperty({ example: 'Smoke House' })
  foodtruckName!: string;

  @ApiProperty({ example: 'spring-festival-2026' })
  eventSlug!: string;

  @ApiProperty({
    type: () => FoodtruckCatalogCategoryDto,
    isArray: true,
  })
  categories!: FoodtruckCatalogCategoryDto[];
}
