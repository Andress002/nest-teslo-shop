import { z } from 'zod';
import { UserRole } from '../enums/roles.enum';
import { LoginUserSchema } from './login-user-schema';

export const RegisterUserSchema = LoginUserSchema.extend({
  fullName: z
    .string()
    .min(5, 'The full name must be at least 5 characters long'),
  rol: z
    .array(z.nativeEnum(UserRole))
    .optional(),
}).strict();