import { Request } from "express";
import { UserRole } from "../../auth/enums/roles.enum";


export interface RequestAuth extends Request {
  user: {
    id: string;
    email: string;
    fullName: string;
    rol: UserRole[];
    token: string;
  }
}