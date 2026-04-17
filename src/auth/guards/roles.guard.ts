import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../enums/roles.enum";
import { RequestAuth } from "../interfaces/request.interface";


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

    if (!requiredRoles) return true

    const { user } = ctx.switchToHttp().getRequest<RequestAuth>();


    const rolExist = requiredRoles.some((role) => user.roles?.includes(role));

    if (!rolExist) {
      throw new ForbiddenException(`Usuario ${user.fullName} no tiene permisos necesario (${requiredRoles.join(', ')})`)
    }

    return true
  }
}
