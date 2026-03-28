import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/public.decorator';
import {
  FoodtruckCatalogResponseDto,
  FoodtruckDetailDto,
  FoodtruckListItemDto,
} from './foodtrucks.dto';
import { FoodtrucksService } from './foodtrucks.service';

@ApiTags('foodtrucks')
@Controller('foodtrucks')
export class FoodtrucksController {
  constructor(private readonly foodtrucksService: FoodtrucksService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List the foodtrucks available in the active event.',
  })
  @ApiOkResponse({
    description: 'Public list of foodtrucks available for discovery.',
    type: FoodtruckListItemDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'No active event is available for public discovery.',
  })
  listFoodtrucks() {
    return this.foodtrucksService.listActiveFoodtrucks();
  }

  @Get(':foodtruckSlug')
  @Public()
  @ApiOperation({
    summary: 'Resolve the detail of a foodtruck in the active event.',
  })
  @ApiParam({
    name: 'foodtruckSlug',
    example: 'smoke-house',
  })
  @ApiOkResponse({
    description: 'Public detail of the selected foodtruck.',
    type: FoodtruckDetailDto,
  })
  @ApiNotFoundResponse({
    description: 'Foodtruck or active event was not found.',
  })
  getFoodtruckDetail(@Param('foodtruckSlug') foodtruckSlug: string) {
    return this.foodtrucksService.getFoodtruckDetail(foodtruckSlug);
  }

  @Get(':foodtruckSlug/catalog')
  @Public()
  @ApiOperation({
    summary: 'Return the initial catalog of a foodtruck in the active event.',
  })
  @ApiParam({
    name: 'foodtruckSlug',
    example: 'smoke-house',
  })
  @ApiOkResponse({
    description:
      'Public catalog grouped by category for the selected foodtruck.',
    type: FoodtruckCatalogResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Foodtruck or active event was not found.',
  })
  getFoodtruckCatalog(@Param('foodtruckSlug') foodtruckSlug: string) {
    return this.foodtrucksService.getFoodtruckCatalog(foodtruckSlug);
  }
}
