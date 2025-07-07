import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqDynamicEntity = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.dynamicEntity;
  },
);
