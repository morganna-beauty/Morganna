import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsFirestoreService } from './products-firestore.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('products')
@Controller('products')
export class ProductsFirestoreController {
  constructor(private readonly productsService: ProductsFirestoreService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('test-create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Test product creation with error handling (Public - for testing)',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully (with or without image)',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProductDto })
  testCreate(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with optional filters and sorting (Public)',
  })
  @ApiQuery({
    name: 'hairType',
    required: false,
    enum: ['liso', 'ondulado', 'rizado', 'afro'],
  })
  @ApiQuery({
    name: 'concern',
    required: false,
    enum: ['cabelloSeco', 'danoReparacion', 'controlFriz', 'volumen'],
  })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'popularity'],
    description: 'Sort products by field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order (ascending or descending)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
  })
  findAll(@Query() filterDto: FilterProductsDto) {
    return this.productsService.findAllProducts(filterDto);
  }

  @Get('filters/options')
  @ApiOperation({ summary: 'Get available filter options (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Filter options retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        hairTypes: { type: 'array', items: { type: 'string' } },
        concerns: { type: 'array', items: { type: 'string' } },
        brands: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  getFilterOptions() {
    return this.productsService.getFilterOptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID (Public)' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('bearer')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
