import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const CheckUserMatch = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userEmailFromToken = String(request.user.email);

    const emailFromBody = request.body?.email;
    const emailFromQuery = request.query?.email;

    const emailAsString = emailFromBody || emailFromQuery;

    if (!emailAsString || userEmailFromToken !== String(emailAsString)) {
      throw new ForbiddenException(
        'You are not allowed to access this information',
      );
    }
  },
);
