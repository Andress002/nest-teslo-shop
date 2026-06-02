import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/roles.enum';
import { RequestAuth } from '../../common/interfaces/request.interface';

@Injectable() //CanActivate: que funcionan como filtros de seguridad encargados de decidir si una solicitud HTTP puede acceder a un controlador o ruta específica
export class RolesGuard implements CanActivate {
  //Reflector nos sirve para poder leer los metadatos === osea las etiquetas
  constructor(private reflector: Reflector) {}

  //El executionContext sirve para proporciona detalles detallados sobre el proceso de ejecución actual de una solicitud
  canActivate(ctx: ExecutionContext): boolean {
    //getAllAndOverryde sirve para resolver metadatos considerando multiples niveles y sobrescribiendo segun prioridad
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        ctx.getHandler(), // Nivel de metodo (aplica a un endpoint específico)
        ctx.getClass(), // Nivel de controlador (aplica a todos los endpoints del controlador)
      ],
    );

    //Si no hay roles definidos en el endpoint ni en el controlador, se permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = ctx.switchToHttp().getRequest<RequestAuth>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado en la peticion.');
    }

    const { rol, fullName } = user;

    const hasRole = rol.some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `El usuario ${fullName} no tiene los permisos necesarios.`,
      );
    }

    return true;
  }
}
