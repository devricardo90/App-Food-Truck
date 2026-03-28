import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { FoodtruckMembershipsService } from './foodtruck-memberships.service';

@Module({
  imports: [PrismaModule],
  providers: [FoodtruckMembershipsService],
  exports: [FoodtruckMembershipsService],
})
export class FoodtruckMembershipsModule {}
