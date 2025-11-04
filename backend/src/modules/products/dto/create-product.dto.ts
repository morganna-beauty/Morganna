import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HairType, Concern } from '../enums/product.enums';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Shampoo Hidratante Argan Oil',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example:
      'Shampoo hidratante enriquecido con aceite de argán para cabello seco',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 29.99,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiPropertyOptional({
    description: 'Product stock quantity',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  stock?: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/shampoo.jpg',
  })
  @IsOptional()
  @IsString()
  imageSrc?: string;

  @ApiPropertyOptional({
    description: 'Hair type the product is designed for',
    enum: HairType,
    example: HairType.RIZADO,
  })
  @IsOptional()
  @IsEnum(HairType)
  hairType?: HairType;

  @ApiPropertyOptional({
    description: 'Hair concern the product addresses',
    enum: Concern,
    example: Concern.CABELLO_SECO,
  })
  @IsOptional()
  @IsEnum(Concern)
  concern?: Concern;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Morganna Beauty',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product benefits list',
    example: ['Hidrata el cabello', 'Reduce el frizz', 'Fortalece las fibras capilares'],
    isArray: true,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim()).filter(v => v);
    }

    return Array.isArray(value) ? value : [];
  })
  benefits?: string[];

  @ApiPropertyOptional({
    description: 'Product ingredients list',
    example: ['Aceite de Argán', 'Keratina hidrolizada', 'Extracto de aloe vera'],
    isArray: true,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim()).filter(v => v);
    }

    return Array.isArray(value) ? value : [];
  })
  ingredients?: string[];
}
