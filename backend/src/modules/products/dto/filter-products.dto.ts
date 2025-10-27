import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HairType, Concern } from '../enums/product.enums';

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
    description: 'Filter by hair concern',
    enum: Concern,
    example: Concern.CABELLO_SECO,
  })
  @IsOptional()
  @IsEnum(Concern)
  concern?: Concern;

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
}
