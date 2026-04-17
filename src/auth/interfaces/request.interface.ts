import { Request } from "express";
import { UserRole } from "../enums/roles.enum";


export interface RequestAuth extends Request {
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: UserRole[];
    token: string;
  }
}