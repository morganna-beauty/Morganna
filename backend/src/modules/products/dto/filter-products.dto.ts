import { IsOptional, IsEnum, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { HairType, Concern } from '../enums/product.enums';

export enum SortBy {
  PRICE = 'price',
  POPULARITY = 'popularity',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterProductsDto {
  @ApiPropertyOptional({
    description: 'Filter by hair type',
    enum: HairType,
    example: HairType.RIZADO,
  })
  @IsOptional()
  @IsEnum(HairType)
  hairType?: HairType;

  @ApiPropertyOptional({
    description: 'Filter by hair concerns (multiple values allowed)',
    enum: Concern,
    isArray: true,
    example: [Concern.CABELLO_SECO, Concern.DANO_REPARACION],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Concern, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim());
    }
    
    return Array.isArray(value) ? value : [value];
  })
  concerns?: Concern[];

  @ApiPropertyOptional({
    description: 'Filter by brand name',
    example: 'Morganna Beauty',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Search in title or description',
    example: 'shampoo',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort products by field',
    enum: SortBy,
    example: SortBy.PRICE,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    enum: Order,
    example: Order.ASC,
  })
  @IsOptional()
  @IsEnum(Order)
  order?: Order;
}
