<<<<<<< HEAD
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
=======
import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { RequestAuth } from "../../common/interfaces/request.interface";



export const GetUser = createParamDecorator(
    //usamos keyof para decirle  solo permito que data solo sea una de las etiquetas de User
    (data: keyof RequestAuth['user'] | undefined, ctx: ExecutionContext) => { //ExecutionContext cambia segun el contexto de la aplicacion (http, ws, rpc)
        const request = ctx.switchToHttp().getRequest<RequestAuth>();
        const user = request.user;

        if (!user) throw new InternalServerErrorException('Error en los parametros')

        return data ? user[data] : user //Aqui le decimos si viene la data entonces devuelveme la data del user, si no el user completo
    })


>>>>>>> ec697ab37739fd5798583db359e8c60851c222c1
