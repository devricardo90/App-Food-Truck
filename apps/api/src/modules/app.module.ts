import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FoodtruckMembershipsModule } from './foodtruck-memberships/foodtruck-memberships.module';
import { FoodtrucksModule } from './foodtrucks/foodtrucks.module';
import { HealthModule } from './health/health.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    FoodtruckMembershipsModule,
    FoodtrucksModule,
    AuthModule,
    OrdersModule,
    HealthModule,
  ],
})
export class AppModule {}
