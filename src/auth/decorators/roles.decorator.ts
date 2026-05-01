import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../enums/roles.enum";

// Esta es la clave (key) con la que guardaremos y buscaremos los datos después
export const ROLES_KEY = 'roles';


// El decorador recibe una lista de strings (ej: 'admin', 'user')
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)



//crear otro guards sobre el owner del productos y si es admin y super_admin pueda entrar tambien