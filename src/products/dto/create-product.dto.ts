import { createZodDto } from 'nestjs-zod';
import { CreateProductSchema } from '../schemas/products-schemas';

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
