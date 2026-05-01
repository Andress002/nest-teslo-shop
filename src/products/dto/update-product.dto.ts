
import { createZodDto } from "nestjs-zod";
import { UpdateProductSchema } from "../schemas/update-products.schemas";

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
