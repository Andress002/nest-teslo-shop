import { createZodDto } from 'nestjs-zod';
import { RegisterUserSchema } from '../schemas/register-user-schema';

export class RegisterUserDto extends createZodDto(RegisterUserSchema) { }