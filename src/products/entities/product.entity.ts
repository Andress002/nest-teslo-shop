import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './porduct-image.entity';
import { User } from 'src/auth/entities/auth.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    unique: true,
  })
  title!: string;

  @Column('float', {
    default: 0,
  })
  price!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string;

  @Column('text', {
    unique: true,
  })
  slug!: string;

  @Column('int', {
    default: 0,
  })
  stock!: number;

  @Column('text', {
    array: true,
  })
  sizes!: string[];

  @Column('text')
  gender!: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags!: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, //el eager sirve cuando buscas un producto usadno find, findOne etc... typeORM trae automaticamente el arreglo de imagnes
  })
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userId'})
  user!: User;

  @Column('uuid')
  userId!: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
