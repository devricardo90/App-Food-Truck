import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { FoodtrucksController } from './foodtrucks.controller';
import { FoodtrucksService } from './foodtrucks.service';

@Module({
  imports: [PrismaModule],
  controllers: [FoodtrucksController],
  providers: [FoodtrucksService],
  exports: [FoodtrucksService],
})
export class FoodtrucksModule {}
