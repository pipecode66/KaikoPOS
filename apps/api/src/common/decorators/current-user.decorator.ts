import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type RequestUser = {
  sub: string;
  email: string;
  displayName: string;
  roles: string[];
};

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext): RequestUser => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
