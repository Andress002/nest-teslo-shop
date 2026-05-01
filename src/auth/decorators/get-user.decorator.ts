import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequestAuth } from 'src/common/interfaces/request.interface';

type AuthenticatedUser = RequestAuth['user'];

export const GetUser = createParamDecorator(
  (
    data: keyof AuthenticatedUser | undefined,
    ctx: ExecutionContext,
  ): AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] => {
    const request = ctx.switchToHttp().getRequest<RequestAuth>();
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in (request)');
    }

    return data ? user[data] : user;
  },
);
