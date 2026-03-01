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
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = pagination;
      const users = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      if (!users) {
        throw new BadRequestException('Usuarios no encontrados');
      }
      return users;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOne(term: string) {
    try {
      let product: Product | null;

      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', {
            //compara tittle =: con el valor del parametro nombrado tittle asi igual se lee con el de slug
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
          .getOne();
      }

      if (!product) {
        throw new BadRequestException(
          `El producto con id ${term} no fue encontrado`,
        );
      }

      return product;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);

      await this.productRepository.remove(product);

      return { message: 'Producto eliminado con exito' };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
