import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HairType, Concern } from '../enums/product.enums';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 500, nullable: true })
  imageSrc: string;

  @Column({
    type: 'enum',
    enum: HairType,
    nullable: true,
  })
  hairType: HairType;

  @Column({
    type: 'enum',
    enum: Concern,
    nullable: true,
  })
  concern: Concern;

  @Column({ length: 100, nullable: true })
  brand: string;
}
