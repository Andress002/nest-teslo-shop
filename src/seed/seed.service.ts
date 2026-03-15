import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}
  async rundSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    /* const insertPromises = products.map((product) =>
      this.productService.create(product),
    );
    await Promise.all(insertPromises); */

    const insertPromises: Promise<any>[] = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}

//"quiero transformar un array" → usa map

//"solo quiero ejecutar algo" → usa forEach
