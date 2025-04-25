import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: any }>();
    const user = request.user;
    return key ? user?.[key] : user;
  },
);
