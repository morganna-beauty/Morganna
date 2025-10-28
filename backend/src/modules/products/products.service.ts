import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto, SortBy } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);

    return await this.productRepository.save(product);
  }

  async findAll(filterDto?: FilterProductsDto): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filterDto?.hairType) {
      queryBuilder.andWhere('product.hairType = :hairType', {
        hairType: filterDto.hairType,
      });
    }

    if (filterDto?.concern) {
      queryBuilder.andWhere('product.concern = :concern', {
        concern: filterDto.concern,
      });
    }

    if (filterDto?.brand) {
      queryBuilder.andWhere('product.brand ILIKE :brand', {
        brand: `%${filterDto.brand}%`,
      });
    }

    if (filterDto?.search) {
      queryBuilder.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (filterDto?.sortBy && filterDto?.order) {
      switch (filterDto.sortBy) {
        case SortBy.PRICE:
          queryBuilder.orderBy('product.price', filterDto.order);
          break;
        case SortBy.POPULARITY:
          queryBuilder.orderBy('product.stock', filterDto.order);
          break;
        default:
          queryBuilder.orderBy('product.createdAt', 'DESC');
      }
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  async getFilterOptions(): Promise<{
    hairTypes: string[];
    concerns: string[];
    brands: string[];
  }> {
    const hairTypes = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.hairType', 'hairType')
      .where('product.hairType IS NOT NULL')
      .getRawMany();

    const concerns = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.concern', 'concern')
      .where('product.concern IS NOT NULL')
      .getRawMany();

    const brands = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('product.brand IS NOT NULL')
      .getRawMany();

    return {
      hairTypes: hairTypes.map((item) => item.hairType).filter(Boolean),
      concerns: concerns.map((item) => item.concern).filter(Boolean),
      brands: brands.map((item) => item.brand).filter(Boolean),
    };
  }
}
