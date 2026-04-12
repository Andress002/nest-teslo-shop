import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/auth.entity';

export const GetUser = createParamDecorator(
  (
    data: keyof User | undefined, //keyof es para decir que data puede ser cualquier propiedad de User o undefined
    ctx: ExecutionContext,
  ): User | User[keyof User] => {
    //si no me pides una propiedad especifica de User, te devuelvo el User completo, si me pides una propiedad especifica,
    // te devuelvo esa propiedad  eso significa que si data es undefined, devuelvo el user completo, si data es una propiedad de User, devuelvo esa propiedad del user
    const req = ctx.switchToHttp().getRequest<Request & { user?: User }>();
    //toma todo lo que tiene una propiedad Request Y que seria el & y le agregas una propiedad llamad user que puede o no esta ahi (opcional) y que es de tipo User
    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in (request)');
    }

    //si data no existe, devuelve el user si no devuelve la propieda del user
    return !data ? user : user?.[data];
  },
);
