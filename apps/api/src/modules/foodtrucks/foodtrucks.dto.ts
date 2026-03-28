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

  @ApiProperty({ example: 'hamburguer / street food', nullable: true })
  primaryCategory!: string | null;

  @ApiProperty({ example: '@funkychickenfoodtruck', nullable: true })
  instagram!: string | null;

  @ApiProperty({ example: '+46 72 270 30 64', nullable: true })
  whatsapp!: string | null;

  @ApiProperty({ example: 'funky-chicken/hero', nullable: true })
  heroImageKey!: string | null;
}

export class FoodtruckDetailDto extends FoodtruckListItemDto {
  @ApiProperty({ example: 'spring-festival-2026' })
  eventSlug!: string;

  @ApiProperty({ example: 'Spring Festival 2026' })
  eventName!: string;

  @ApiProperty({ example: 'funky-chicken/logo', nullable: true })
  logoImageKey!: string | null;

  @ApiProperty({
    example:
      'Segunda a sexta no almoco; fins de semana variam conforme agenda.',
    nullable: true,
  })
  operatingDays!: string | null;

  @ApiProperty({ example: '10:30', nullable: true })
  openingTime!: string | null;

  @ApiProperty({ example: '14:00', nullable: true })
  closingTime!: string | null;
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

  @ApiProperty({ example: 'SEK' })
  currency!: string;

  @ApiProperty({ example: true })
  isAvailable!: boolean;

  @ApiProperty({ example: 10, nullable: true })
  dailyStockRemaining!: number | null;

  @ApiProperty({ example: 0 })
  sortOrder!: number;

  @ApiProperty({
    example: 'funky-chicken/burger',
    nullable: true,
  })
  imageKey!: string | null;
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
