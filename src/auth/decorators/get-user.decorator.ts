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


