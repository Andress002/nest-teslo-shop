import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from "../entities/auth.entity";
import { RequestAuth } from "../interfaces/request.interface";



export const GetUser = createParamDecorator(
    //usamos keyof para decirle  solo permito que data solo sea una de las etiquetas de User
    (data: keyof RequestAuth['user'] | undefined, ctx: ExecutionContext) => { //ExecutionContext cambia segun el contexto de la aplicacion (http, ws, rpc)
        const request = ctx.switchToHttp().getRequest<RequestAuth>();
        const user = request.user

        if (!user) throw new InternalServerErrorException('Error en los parametros')

        return data ? user[data] : user
    })



