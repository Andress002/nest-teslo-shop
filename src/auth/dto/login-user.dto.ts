import { createZodDto } from 'nestjs-zod';
import { LoginUserSchema } from '../schemas/login-user-schema';

export class LoginUserDto extends createZodDto(LoginUserSchema) {}