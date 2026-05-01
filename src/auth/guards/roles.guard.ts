import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../enums/roles.enum";
import { RequestAuth } from "../../common/interfaces/request.interface";


@Injectable()  //CanActivate: que funcionan como filtros de seguridad encargados de decidir si una solicitud HTTP puede acceder a un controlador o ruta específica
export class RolesGuard implements CanActivate {
  //Reflector nos sirve para poder leer los metadatos === osea las etiquetas
  constructor(private reflector: Reflector) { }

  //El executionContext sirve para proporciona detalles detallados sobre el proceso de ejecución actual de una solicitud
  canActivate(ctx: ExecutionContext): boolean {


    //getAllAndOverryde sirve para resolver metadatos considerando multiples niveles y sobrescribiendo segun prioridad
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      ctx.getHandler(), //Apunta al método del controller que maneja la request // nivel endpoint (aplica al metodo del controller)
      ctx.getClass() //Apunta a la clase del controller //nivel controller (aplica a todos los endpoints dentro)
    ]);

    //Si no hay roles definidos en el endpoint ni en el controlador, se permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) return true

    const { user } = ctx.switchToHttp().getRequest<RequestAuth>();

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado')
    }

    const hasRole = user.rol.some((role => requiredRoles.includes(role as UserRole)))


    if (!hasRole) {
      throw new ForbiddenException(`El usuario ${user.fullName} no tiene los permisos necesarios.`)
    }

    return true
  }
}


