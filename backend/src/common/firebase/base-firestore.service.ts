import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  FirebaseService,
  FirestoreDocument,
  QueryOptions,
} from './firebase.service';

export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseFirestoreDocument extends FirestoreDocument {
  createdAt?: FirebaseFirestore.Timestamp | Date;
  updatedAt?: FirebaseFirestore.Timestamp | Date;
}

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface SearchableFields {
  [key: string]: string[];
}

@Injectable()
export abstract class BaseFirestoreService<
  TEntity extends BaseEntity,
  TFirestoreDoc extends BaseFirestoreDocument,
  TCreateDto,
  TUpdateDto,
> {
  protected readonly logger = new Logger(this.constructor.name);

  protected abstract readonly collectionName: string;

  protected abstract readonly searchFields: SearchableFields;

  constructor(protected readonly firebaseService: FirebaseService) {}

  async create(createDto: TCreateDto): Promise<TEntity> {
    const firestoreData = this.mapCreateDtoToFirestore(createDto);
    const created = await this.firebaseService.create<TFirestoreDoc>(
      this.collectionName,
      firestoreData,
    );

    return this.mapFirestoreToEntity(created);
  }

  async findAll(filterOptions?: FilterOptions): Promise<TEntity[]> {
    const queryOptions: QueryOptions = {
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    };

    let documents = await this.firebaseService.getCollection<TFirestoreDoc>(
      this.collectionName,
      queryOptions,
    );

    // Apply search filter
    if (filterOptions?.search) {
      documents = this.applySearchFilter(documents, filterOptions.search);
    }

    // Apply sorting
    if (filterOptions?.sortBy && filterOptions?.order) {
      documents = this.applySorting(
        documents,
        filterOptions.sortBy,
        filterOptions.order,
      );
    }

    return documents.map((doc) => this.mapFirestoreToEntity(doc));
  }

  async findOne(id: string): Promise<TEntity> {
    const document = await this.firebaseService.getDocument<TFirestoreDoc>(
      this.collectionName,
      id,
    );

    if (!document) {
      throw new NotFoundException(
        `${this.getEntityName()} with ID ${id} not found`,
      );
    }

    return this.mapFirestoreToEntity(document);
  }

  async update(id: string, updateDto: TUpdateDto): Promise<TEntity> {
    await this.ensureDocumentExists(id);

    const updateData = this.mapUpdateDtoToFirestore(updateDto);
    const updated = await this.firebaseService.updateDocument<TFirestoreDoc>(
      this.collectionName,
      id,
      updateData,
    );

    return this.mapFirestoreToEntity(updated);
  }

  async remove(id: string): Promise<void> {
    await this.ensureDocumentExists(id);
    await this.firebaseService.deleteDocument(this.collectionName, id);
  }

  async findByField(field: string, value: any): Promise<TEntity[]> {
    const documents = await this.firebaseService.findByField<TFirestoreDoc>(
      this.collectionName,
      field,
      value,
    );

    return documents.map((doc) => this.mapFirestoreToEntity(doc));
  }

  async findOneByField(field: string, value: any): Promise<TEntity | null> {
    const document = await this.firebaseService.findOneByField<TFirestoreDoc>(
      this.collectionName,
      field,
      value,
    );

    return document ? this.mapFirestoreToEntity(document) : null;
  }

  protected async ensureDocumentExists(id: string): Promise<void> {
    const exists = await this.firebaseService.documentExists(
      this.collectionName,
      id,
    );

    if (!exists) {
      throw new NotFoundException(
        `${this.getEntityName()} with ID ${id} not found`,
      );
    }
  }

  protected applySearchFilter(
    documents: TFirestoreDoc[],
    searchTerm: string,
  ): TFirestoreDoc[] {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (!normalizedSearch) return documents;

    return documents.filter((doc) => {
      return Object.entries(this.searchFields).some(
        ([_fieldKey, searchPaths]) => {
          return searchPaths.some((path) => {
            const value = this.getNestedValue(doc, path);

            return value?.toString().toLowerCase().includes(normalizedSearch);
          });
        },
      );
    });
  }

  protected applySorting(
    documents: TFirestoreDoc[],
    sortBy: string,
    order: 'asc' | 'desc',
  ): TFirestoreDoc[] {
    return documents.sort((a, b) => {
      const aValue = this.getSortValue(a, sortBy);
      const bValue = this.getSortValue(b, sortBy);

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;

      return order === 'asc' ? comparison : -comparison;
    });
  }

  protected getSortValue(document: TFirestoreDoc, sortBy: string): any {
    return this.getNestedValue(document, sortBy) || 0;
  }

  protected getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  protected convertFirestoreTimestamp(
    timestamp: FirebaseFirestore.Timestamp | Date | undefined,
  ): Date {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      return (timestamp as any).toDate();
    }

    return new Date();
  }

  protected abstract mapCreateDtoToFirestore(
    createDto: TCreateDto,
  ): Omit<TFirestoreDoc, 'id'>;

  protected abstract mapUpdateDtoToFirestore(
    updateDto: TUpdateDto,
  ): Partial<TFirestoreDoc>;

  protected abstract mapFirestoreToEntity(document: TFirestoreDoc): TEntity;

  protected abstract getEntityName(): string;
}
