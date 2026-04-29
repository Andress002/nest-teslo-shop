import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { ProductResponse } from 'src/types/ProductResponse';
import { buildProductResponse } from './mappers/product.mapper';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto, user: User): Promise<ProductResponse> {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);

      return buildProductResponse(product)


    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findAll(pagination: PaginationDto): Promise<ProductResponse[]> {
    try {
      const { limit = 10, offset = 0 } = pagination;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      if (products.length === 0) {
        throw new BadRequestException('productos no encontrados');
      }
      return products.map(product => buildProductResponse(product))
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOne(term: string): Promise<ProductResponse> {
    try {
      let product: Product | null;
 
      if (isUUID(term)) {
        product = await this.productRepository.findOne({
          where: { id: term },
          relations: ['images'],
        });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', {
            //compara tittle =: con el valor del parametro nombrado tittle asi igual se lee con el de slug
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }

      if (!product) {
        throw new BadRequestException(
          `El producto con id ${term} no fue encontrado`,
        );
      }

      return buildProductResponse(product)
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOnePlain(term: string): Promise<ProductResponse> {
    const product = await this.findOne(term);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponse> {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
 
        product.images = images.map((image) =>
          queryRunner.manager.create(ProductImage, { url: image }),
        );
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      return buildProductResponse(product)
      
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error actualizando el producto, revisa los log',
      );
    }
    finally {
      await queryRunner.release(); //cierra conexion.
    }
  }

  async remove(id: string): Promise<ProductResponse> {
    try {
      const product = await this.findOne(id);
      
      await this.productRepository.delete(id);

      return product
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}


/* 
type DeepReadonly<T> =
  T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

*/


/* type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T


type DeepNonNullable<T> = 
  T extends object ? {[ K in keyof T ] : DeepNonNullable<NonNullable<T[K]>>} : NonNullable<T>
 */


/* 
Tu código funciona, pero para ser un Arquitecto de Software impecable, recuerda:

"Entidades para trabajar por dentro, Responses (Mappers) para responder por fuera".
*/


//investigar softDelete