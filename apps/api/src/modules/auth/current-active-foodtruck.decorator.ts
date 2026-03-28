import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthMembershipContext } from './auth.types';

type RequestWithActiveFoodtruck = {
  activeFoodtruck?: AuthMembershipContext;
};

export const CurrentActiveFoodtruck = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithActiveFoodtruck>();

    return request.activeFoodtruck;
  },
);
