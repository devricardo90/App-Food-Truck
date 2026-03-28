import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { FoodtruckMembershipsModule } from './foodtruck-memberships/foodtruck-memberships.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    FoodtruckMembershipsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
