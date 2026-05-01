import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(6, { message: 'The password must be at least 6 characters long' })
    .max(50, { message: 'The password must not exceed 50 characters' })
    .regex(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'The password must have a Uppercase, lowercase letter and a number'
    ),
}).strict();