import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FirebaseService,
  QueryOptions,
} from '../../common/firebase/firebase.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto, SortBy } from './dto/filter-products.dto';
import { FirestoreProduct } from './interfaces/firestore-product.interface';

@Injectable()
export class ProductsFirestoreService {
  private readonly collectionName = 'products';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const firestoreProduct: Omit<FirestoreProduct, 'id'> = {
      title: createProductDto.title,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock || 0,
      imageSrc: createProductDto.imageSrc,
      hairType: createProductDto.hairType,
      concern: createProductDto.concern,
      brand: createProductDto.brand,
    };

    const createdProduct = await this.firebaseService.create<FirestoreProduct>(
      this.collectionName,
      firestoreProduct,
    );

    return this.mapFirestoreProductToEntity(createdProduct);
  }

  async findAll(filterDto?: FilterProductsDto): Promise<Product[]> {
    try {
      if (
        !filterDto ||
        (!filterDto.hairType && !filterDto.concern && !filterDto.brand)
      ) {
        const queryOptions: QueryOptions = {
          orderBy: [
            {
              field: 'createdAt',
              direction: 'desc',
            },
          ],
        };

        let firestoreProducts =
          await this.firebaseService.getCollection<FirestoreProduct>(
            this.collectionName,
            queryOptions,
          );

        if (filterDto?.search) {
          const searchTerm = filterDto.search.toLowerCase();

          firestoreProducts = firestoreProducts.filter(
            (product) =>
              product.title?.toLowerCase().includes(searchTerm) ||
              product.description?.toLowerCase().includes(searchTerm),
          );
        }

        if (filterDto?.sortBy && filterDto?.order) {
          firestoreProducts.sort((a, b) => {
            let aValue, bValue;

            switch (filterDto.sortBy) {
              case SortBy.PRICE:
                aValue = a.price || 0;
                bValue = b.price || 0;
                break;
              case SortBy.POPULARITY:
                aValue = a.stock || 0;
                bValue = b.stock || 0;
                break;
              default:
                return 0;
            }

            if (filterDto.order?.toLowerCase() === 'asc') {
              return aValue - bValue;
            } else {
              return bValue - aValue;
            }
          });
        }

        return firestoreProducts.map((product) =>
          this.mapFirestoreProductToEntity(product),
        );
      }

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
        const searchTerm = filterDto.search.toLowerCase();

        filteredProducts = filteredProducts.filter(
          (product) =>
            product.title?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm),
        );
      }

      if (filterDto?.sortBy && filterDto?.order) {
        filteredProducts.sort((a, b) => {
          let aValue, bValue;

          switch (filterDto.sortBy) {
            case SortBy.PRICE:
              aValue = a.price || 0;
              bValue = b.price || 0;
              break;
            case SortBy.POPULARITY:
              aValue = a.stock || 0;
              bValue = b.stock || 0;
              break;
            default:
              return 0;
          }

          if (filterDto.order?.toLowerCase() === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
      } else {
        filteredProducts.sort((a, b) => {
          const aDate = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bDate = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;

          return bDate - aDate;
        });
      }

      return filteredProducts.map((product) =>
        this.mapFirestoreProductToEntity(product),
      );
    } catch (error) {
      const allProducts =
        await this.firebaseService.getCollection<FirestoreProduct>(
          this.collectionName,
        );

      return allProducts.map((product) =>
        this.mapFirestoreProductToEntity(product),
      );
    }
  }

  async findOne(id: string): Promise<Product> {
    const firestoreProduct =
      await this.firebaseService.getDocument<FirestoreProduct>(
        this.collectionName,
        id,
      );

    if (!firestoreProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.mapFirestoreProductToEntity(firestoreProduct);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct =
      await this.firebaseService.getDocument<FirestoreProduct>(
        this.collectionName,
        id,
      );

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updateData: Partial<FirestoreProduct> = {};

    if (updateProductDto.title !== undefined) {
      updateData.title = updateProductDto.title;
    }

    if (updateProductDto.description !== undefined) {
      updateData.description = updateProductDto.description;
    }

    if (updateProductDto.price !== undefined) {
      updateData.price = updateProductDto.price;
    }

    if (updateProductDto.stock !== undefined) {
      updateData.stock = updateProductDto.stock;
    }

    if (updateProductDto.imageSrc !== undefined) {
      updateData.imageSrc = updateProductDto.imageSrc;
    }

    if (updateProductDto.hairType !== undefined) {
      updateData.hairType = updateProductDto.hairType;
    }

    if (updateProductDto.concern !== undefined) {
      updateData.concern = updateProductDto.concern;
    }

    if (updateProductDto.brand !== undefined) {
      updateData.brand = updateProductDto.brand;
    }

    const updatedProduct =
      await this.firebaseService.updateDocument<FirestoreProduct>(
        this.collectionName,
        id,
        updateData,
      );

    return this.mapFirestoreProductToEntity(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const existingProduct =
      await this.firebaseService.getDocument<FirestoreProduct>(
        this.collectionName,
        id,
      );

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.firebaseService.deleteDocument(this.collectionName, id);
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

    const hairTypes = new Set<string>();
    const concerns = new Set<string>();
    const brands = new Set<string>();

    allProducts.forEach((product) => {
      if (product.hairType) {
        hairTypes.add(product.hairType);
      }

      if (product.concern) {
        concerns.add(product.concern);
      }

      if (product.brand) {
        brands.add(product.brand);
      }
    });

    return {
      hairTypes: Array.from(hairTypes).filter(Boolean),
      concerns: Array.from(concerns).filter(Boolean),
      brands: Array.from(brands).filter(Boolean),
    };
  }

  private mapFirestoreProductToEntity(
    firestoreProduct: FirestoreProduct,
  ): Product {
    const product = new Product();

    product.id = parseInt(firestoreProduct.id || '0', 10);
    product.title = firestoreProduct.title;
    product.description = firestoreProduct.description || null;
    product.price = firestoreProduct.price;
    product.stock = firestoreProduct.stock;
    product.imageSrc = firestoreProduct.imageSrc || null;
    product.hairType = firestoreProduct.hairType || null;
    product.concern = firestoreProduct.concern || null;
    product.brand = firestoreProduct.brand || null;

    if (firestoreProduct.createdAt) {
      product.createdAt = this.convertFirestoreTimestamp(
        firestoreProduct.createdAt,
      );
    }

    if (firestoreProduct.updatedAt) {
      product.updatedAt = this.convertFirestoreTimestamp(
        firestoreProduct.updatedAt,
      );
    }

    return product;
  }

  private convertFirestoreTimestamp(
    timestamp: FirebaseFirestore.Timestamp | Date,
  ): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }

    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      return (timestamp as any).toDate();
    }

    return new Date();
  }
}
