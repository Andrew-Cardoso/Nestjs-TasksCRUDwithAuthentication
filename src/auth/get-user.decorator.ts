import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest();
  return user;
});
