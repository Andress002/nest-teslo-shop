import { z } from 'zod';

export const CreateProductSchema = z
  .object({
    title: z.string().min(1, 'El titulo es requerido'),
    price: z.number().positive('El precio debe ser mayor a 0'),
    description: z.string().optional(),
    slug: z.string().optional(),
    stock: z.number().optional(),
    sizes: z.array(z.string()),
    gender: z.enum(['men', 'women', 'kid', 'unisex']),
    tags: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
  })
  .strict();
