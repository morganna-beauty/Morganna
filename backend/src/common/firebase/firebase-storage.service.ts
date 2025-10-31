import { Injectable, Logger } from '@nestjs/common';
import { FirebaseConfig } from './firebase.config';
import { v4 as uuidv4 } from 'uuid';
import {
  MulterFile,
  UploadResult,
  StorageFolders,
  FIREBASE_STORAGE_CONSTANTS,
} from '../types/firebase-storage.types';
import { ValidationUtils } from '../utils/validation.utils';

@Injectable()
export class FirebaseStorageService {
  private readonly logger = new Logger(FirebaseStorageService.name);

  private readonly bucket: any;

  private readonly bucketName: string;

  constructor(private firebaseConfig: FirebaseConfig) {
    const storage = firebaseConfig.getStorage();
    const projectId = firebaseConfig.getApp().options.projectId;

    this.bucketName = `${projectId}.appspot.com`;
    this.bucket = storage.bucket(this.bucketName);
  }

  async uploadFile(
    file: MulterFile,
    folder: string = StorageFolders.UPLOADS,
  ): Promise<UploadResult> {
    // Validate input
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new Error('Invalid file: File is empty or corrupted');
    }

    if (!ValidationUtils.isValidString(file.originalname)) {
      throw new Error('Invalid file: File must have a valid name');
    }

    if (file.size > FIREBASE_STORAGE_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(
        `File too large: Maximum size is ${FIREBASE_STORAGE_CONSTANTS.MAX_FILE_SIZE_MB}MB`,
      );
    }

    try {
      const sanitizedFolder = ValidationUtils.sanitizeString(folder);
      const fileName = `${sanitizedFolder}/${uuidv4()}-${file.originalname}`;

      const fileUpload = this.bucket.file(fileName);

      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          this.logger.error('Upload error:', error);
          reject(error);
        });

        stream.on('finish', async () => {
          try {
            await fileUpload.makePublic();

            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;

            const result: UploadResult = {
              fileName,
              originalName: file.originalname,
              url: publicUrl,
              size: file.size,
              mimeType: file.mimetype,
            };

            this.logger.log(`File uploaded successfully: ${fileName}`);
            resolve(result);
          } catch (error) {
            this.logger.error('Error making file public:', error);
            reject(error);
          }
        });

        stream.end(file.buffer);
      });
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const file = this.bucket.file(fileName);

      await file.delete();

      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error(`Error deleting file ${fileName}:`, error);
      throw error;
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    try {
      const file = this.bucket.file(fileName);
      const [exists] = await file.exists();

      if (!exists) {
        throw new Error(`File ${fileName} does not exist`);
      }

      return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    } catch (error) {
      this.logger.error(`Error getting file URL for ${fileName}:`, error);
      throw error;
    }
  }

  async getSignedUrl(
    fileName: string,
    expiration: Date = new Date(
      Date.now() +
        FIREBASE_STORAGE_CONSTANTS.DEFAULT_EXPIRATION_HOURS * 60 * 60 * 1000,
    ),
  ): Promise<string> {
    try {
      const file = this.bucket.file(fileName);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: expiration,
      });

      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed URL for ${fileName}:`, error);
      throw error;
    }
  }

  async listFiles(folder: string = StorageFolders.UPLOADS): Promise<string[]> {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: folder + '/',
      });

      return files.map((file) => file.name);
    } catch (error) {
      this.logger.error(`Error listing files in folder ${folder}:`, error);
      throw error;
    }
  }

  extractFileNameFromUrl(url: string): string | null {
    if (!url || !ValidationUtils.isValidString(url)) {
      return null;
    }

    try {
      const match = url.match(/\/([^\/]+)$/);

      return match ? match[1] : null;
    } catch (error) {
      this.logger.error('Error extracting filename from URL:', error);

      return null;
    }
  }

  getFileNameFromStorage(url: string): string | null {
    if (!url || !ValidationUtils.isValidString(url)) {
      return null;
    }

    try {
      const baseUrl = `https://storage.googleapis.com/${this.bucketName}/`;

      if (url.startsWith(baseUrl)) {
        return url.replace(baseUrl, '');
      }

      return null;
    } catch (error) {
      this.logger.error('Error extracting storage filename from URL:', error);

      return null;
    }
  }
}
