import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequestAuth } from 'src/common/interfaces/request.interface';

export const GetUser = createParamDecorator(
  <K extends keyof NonNullable<RequestAuth['user']>>(
    data: K | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<RequestAuth>();
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return data ? user[data] : user;
  },
);
