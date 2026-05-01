import { Product } from "src/products/entities";
import { ProductResponse } from "src/types/ProductResponse";

export const buildProductResponse = (product: Product): ProductResponse => {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description,
    slug: product.slug,
    stock: product.stock,
    sizes: product.sizes ?? [],
    gender: product.gender,
    tags: product.tags ?? [],
    images: product.images?.map(img => img.url) ?? [],
  };
};
