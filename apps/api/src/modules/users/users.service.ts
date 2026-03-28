import { Injectable } from '@nestjs/common';

import { UserRole } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { UpsertAuthUserInput } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByExternalAuthId(externalAuthId: string) {
    return this.prisma.user.findUnique({
      where: {
        externalAuthId,
      },
    });
  }

  async upsertAuthUser(input: UpsertAuthUserInput) {
    const existingUser = await this.findByExternalAuthId(input.externalAuthId);

    if (!existingUser) {
      return this.prisma.user.create({
        data: {
          externalAuthId: input.externalAuthId,
          email: input.email,
          phone: input.phone,
          name: input.name,
          role: UserRole.customer,
        },
      });
    }

    return this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        email: input.email,
        phone: input.phone,
        name: input.name,
      },
    });
  }
}
