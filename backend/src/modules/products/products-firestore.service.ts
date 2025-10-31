import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto, SortBy } from './dto/filter-products.dto';
import { FirestoreProduct } from './interfaces/firestore-product.interface';
import { BaseFirestoreService } from '../../common/firebase/base-firestore.service';
import { FirebaseService } from '../../common/firebase/firebase.service';
import { FirebaseStorageService } from '../../common/firebase/firebase-storage.service';
import {
  TransformUtils,
  ValidationUtils,
} from '../../common/utils/validation.utils';

@Injectable()
export class ProductsFirestoreService extends BaseFirestoreService<
  Product,
  FirestoreProduct,
  CreateProductDto,
  UpdateProductDto
> {
  protected readonly collectionName = 'products';

  protected readonly searchFields = {
    text: ['title', 'description', 'brand'],
  };

  constructor(
    firebaseService: FirebaseService,
    private readonly storageService: FirebaseStorageService,
  ) {
    super(firebaseService);
  }

  protected mapCreateDtoToFirestore(
    createDto: CreateProductDto,
  ): Omit<FirestoreProduct, 'id'> {
    const firestoreData: any = {
      title: createDto.title,
      description: createDto.description,
      price: createDto.price,
      stock: createDto.stock || 0,
      hairType: createDto.hairType,
      concern: createDto.concern,
      brand: createDto.brand,
    };

    // Solo agregar imageSrc si no es null o undefined
    if (createDto.imageSrc !== null && createDto.imageSrc !== undefined) {
      firestoreData.imageSrc = createDto.imageSrc;
    }

    return firestoreData as Omit<FirestoreProduct, 'id'>;
  }

  private async validateImageUrl(imageUrl: string): Promise<boolean> {
    if (!imageUrl || !ValidationUtils.isValidString(imageUrl)) {
      return false;
    }

    try {
      if (
        imageUrl.includes('firebasestorage.googleapis.com') ||
        imageUrl.includes('storage.googleapis.com')
      ) {
        const fileName = this.storageService.getFileNameFromStorage(imageUrl);

        if (fileName) {
          await this.storageService.getFileUrl(fileName);

          return true;
        }
      }

      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;

      return urlPattern.test(imageUrl);
    } catch (error) {
      this.logger.warn(
        `Image validation failed for URL: ${imageUrl}`,
        error.message,
      );

      return false;
    }
  }

  async create(createDto: CreateProductDto): Promise<Product> {
    try {
      return await super.create(createDto);
    } catch (error) {
      this.logger.warn(
        'Failed to create product with image, attempting without image:',
        error.message,
      );

      if (createDto.imageSrc) {
        const productWithoutImage = { ...createDto, imageSrc: null };

        this.logger.log(
          `Creating product "${createDto.title}" without image due to storage error`,
        );

        try {
          return await super.create(productWithoutImage);
        } catch (secondError) {
          this.logger.error(
            'Failed to create product even without image:',
            secondError,
          );
          throw secondError;
        }
      }

      throw error;
    }
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    try {
      return await super.update(id, updateDto);
    } catch (error) {
      this.logger.warn(
        'Failed to update product with image, attempting without image change:',
        error.message,
      );

      if (updateDto.imageSrc !== undefined) {
        const updateWithoutImage = { ...updateDto };

        delete updateWithoutImage.imageSrc;

        this.logger.log(
          `Updating product ${id} without image change due to storage error`,
        );

        try {
          return await super.update(id, updateWithoutImage);
        } catch (secondError) {
          this.logger.error(
            'Failed to update product even without image change:',
            secondError,
          );
          throw secondError;
        }
      }

      throw error;
    }
  }

  protected mapUpdateDtoToFirestore(
    updateDto: UpdateProductDto,
  ): Partial<FirestoreProduct> {
    return TransformUtils.removeUndefined({
      title: updateDto.title,
      description: updateDto.description,
      price: updateDto.price,
      stock: updateDto.stock,
      imageSrc: updateDto.imageSrc,
      hairType: updateDto.hairType,
      concern: updateDto.concern,
      brand: updateDto.brand,
    });
  }

  protected mapFirestoreToEntity(document: FirestoreProduct): Product {
    const product = new Product();

    product.id = TransformUtils.safeParseInt(document.id);
    product.title = document.title;
    product.description = document.description || null;
    product.price = document.price;
    product.stock = document.stock;
    product.imageSrc = document.imageSrc || null;
    product.hairType = document.hairType || null;
    product.concern = document.concern || null;
    product.brand = document.brand || null;
    product.createdAt = this.convertFirestoreTimestamp(document.createdAt);
    product.updatedAt = this.convertFirestoreTimestamp(document.updatedAt);

    return product;
  }

  protected getEntityName(): string {
    return 'Product';
  }

  async findAllProducts(filterDto?: FilterProductsDto): Promise<Product[]> {
    try {
      if (
        !filterDto ||
        (!filterDto.hairType && !filterDto.concern && !filterDto.brand)
      ) {
        const baseFilterOptions = {
          search: filterDto?.search,
          sortBy: this.mapSortBy(filterDto?.sortBy),
          order: filterDto?.order?.toLowerCase() as 'asc' | 'desc',
        };

        return await super.findAll(baseFilterOptions);
      }

      return await this.findAllWithFilters(filterDto);
    } catch (error) {
      this.logger.error(
        'Error in findAll, falling back to basic query:',
        error,
      );

      return await super.findAll();
    }
  }

  private async findAllWithFilters(
    filterDto: FilterProductsDto,
  ): Promise<Product[]> {
    const allProducts =
      await this.firebaseService.getCollection<FirestoreProduct>(
        this.collectionName,
      );

    let filteredProducts = allProducts;

    if (filterDto.hairType) {
      filteredProducts = filteredProducts.filter(
        (product) => product.hairType === filterDto.hairType,
      );
    }

    if (filterDto.concern) {
      filteredProducts = filteredProducts.filter(
        (product) => product.concern === filterDto.concern,
      );
    }

    if (filterDto.brand) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand === filterDto.brand,
      );
    }

    if (filterDto.search) {
      filteredProducts = this.applySearchFilter(
        filteredProducts,
        filterDto.search,
      );
    }

    // Apply sorting using base implementation
    if (filterDto?.sortBy && filterDto?.order) {
      filteredProducts = this.applySorting(
        filteredProducts,
        this.mapSortBy(filterDto.sortBy),
        filterDto.order?.toLowerCase() as 'asc' | 'desc',
      );
    } else {
      filteredProducts = this.applySorting(
        filteredProducts,
        'createdAt',
        'desc',
      );
    }

    return filteredProducts.map((product) =>
      this.mapFirestoreToEntity(product),
    );
  }

  protected getSortValue(document: FirestoreProduct, sortBy: string): any {
    switch (sortBy) {
      case 'price':
        return document.price || 0;
      case 'stock':
        return document.stock || 0;
      case 'createdAt':
        return this.convertFirestoreTimestamp(document.createdAt).getTime();
      default:
        return 0;
    }
  }

  private mapSortBy(sortBy?: SortBy): string {
    switch (sortBy) {
      case SortBy.PRICE:
        return 'price';
      case SortBy.POPULARITY:
        return 'stock';
      default:
        return 'createdAt';
    }
  }

  async getFilterOptions(): Promise<{
    hairTypes: string[];
    concerns: string[];
    brands: string[];
  }> {
    const allProducts =
      await this.firebaseService.getCollection<FirestoreProduct>(
        this.collectionName,
      );

    const extractUniqueValues = (field: keyof FirestoreProduct): string[] => {
      const values = new Set<string>();

      allProducts.forEach((product) => {
        const value = product[field];

        if (value && typeof value === 'string') {
          values.add(value);
        }
      });

      return Array.from(values).sort();
    };

    return {
      hairTypes: extractUniqueValues('hairType'),
      concerns: extractUniqueValues('concern'),
      brands: extractUniqueValues('brand'),
    };
  }
}
