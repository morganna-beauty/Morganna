import { Injectable, Logger } from '@nestjs/common';
import { FirebaseConfig } from './firebase.config';
import * as admin from 'firebase-admin';

export interface FirestoreDocument {
  id?: string;
  [key: string]: any;
}

export interface QueryOptions {
  where?: Array<{
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction?: 'asc' | 'desc';
  }>;
  limit?: number;
  offset?: number;
}

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  private firestore: admin.firestore.Firestore;

  constructor(private firebaseConfig: FirebaseConfig) {
    this.firestore = firebaseConfig.getFirestore();
  }

  async create<T extends FirestoreDocument>(
    collectionName: string,
    data: Omit<T, 'id'>,
    customId?: string,
  ): Promise<T> {
    try {
      const docData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      let docRef: admin.firestore.DocumentReference;

      if (customId) {
        docRef = this.firestore.collection(collectionName).doc(customId);
        await docRef.set(docData);
      } else {
        docRef = await this.firestore.collection(collectionName).add(docData);
      }

      const doc = await docRef.get();
      const result = { id: doc.id, ...doc.data() } as T;

      this.logger.log(
        `Document created in ${collectionName} with ID: ${doc.id}`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  async getCollection<T extends FirestoreDocument>(
    collectionName: string,
    options?: QueryOptions,
  ): Promise<T[]> {
    try {
      let query: admin.firestore.Query =
        this.firestore.collection(collectionName);

      if (options?.where) {
        for (const whereClause of options.where) {
          query = query.where(
            whereClause.field,
            whereClause.operator,
            whereClause.value,
          );
        }
      }

      if (options?.orderBy) {
        for (const orderClause of options.orderBy) {
          query = query.orderBy(
            orderClause.field,
            orderClause.direction || 'asc',
          );
        }
      }

      if (options?.offset) {
        query = query.offset(options.offset);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      this.logger.log(
        `Retrieved ${documents.length} documents from ${collectionName}`,
      );

      return documents;
    } catch (error) {
      this.logger.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  async getDocument<T extends FirestoreDocument>(
    collectionName: string,
    id: string,
  ): Promise<T | null> {
    try {
      const doc = await this.firestore.collection(collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const result = { id: doc.id, ...doc.data() } as T;

      this.logger.log(
        `Document retrieved from ${collectionName} with ID: ${id}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error getting document ${id} from ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async updateDocument<T extends FirestoreDocument>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T> {
    try {
      const docRef = this.firestore.collection(collectionName).doc(id);

      const updateData = {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const result = { id: updatedDoc.id, ...updatedDoc.data() } as T;

      this.logger.log(`Document updated in ${collectionName} with ID: ${id}`);

      return result;
    } catch (error) {
      this.logger.error(
        `Error updating document ${id} in ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      await this.firestore.collection(collectionName).doc(id).delete();
      this.logger.log(`Document deleted from ${collectionName} with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Error deleting document ${id} from ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async findByField<T extends FirestoreDocument>(
    collectionName: string,
    field: string,
    value: any,
  ): Promise<T[]> {
    return this.getCollection<T>(collectionName, {
      where: [{ field, operator: '==', value }],
    });
  }

  async findOneByField<T extends FirestoreDocument>(
    collectionName: string,
    field: string,
    value: any,
  ): Promise<T | null> {
    const documents = await this.findByField<T>(collectionName, field, value);

    return documents.length > 0 ? documents[0] : null;
  }

  async executeBatch(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      collection: string;
      id?: string;
      data?: any;
    }>,
  ): Promise<void> {
    try {
      const batch = this.firestore.batch();

      for (const operation of operations) {
        const docRef = operation.id
          ? this.firestore.collection(operation.collection).doc(operation.id)
          : this.firestore.collection(operation.collection).doc();

        switch (operation.type) {
          case 'create':
            batch.set(docRef, {
              ...operation.data,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...operation.data,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      }

      await batch.commit();
      this.logger.log(
        `Batch operation completed with ${operations.length} operations`,
      );
    } catch (error) {
      this.logger.error('Error executing batch operation:', error);
      throw error;
    }
  }

  async documentExists(collectionName: string, id: string): Promise<boolean> {
    try {
      const doc = await this.firestore.collection(collectionName).doc(id).get();

      return doc.exists;
    } catch (error) {
      this.logger.error(
        `Error checking if document exists ${id} in ${collectionName}:`,
        error,
      );
      throw error;
    }
  }

  async getCount(
    collectionName: string,
    options?: QueryOptions,
  ): Promise<number> {
    try {
      let query: admin.firestore.Query =
        this.firestore.collection(collectionName);

      if (options?.where) {
        for (const whereClause of options.where) {
          query = query.where(
            whereClause.field,
            whereClause.operator,
            whereClause.value,
          );
        }
      }

      const snapshot = await query.get();

      return snapshot.size;
    } catch (error) {
      this.logger.error(`Error getting count from ${collectionName}:`, error);
      throw error;
    }
  }
}
