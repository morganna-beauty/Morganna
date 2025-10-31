export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

export interface FirebaseStorageBucket {
  file(fileName: string): FirebaseStorageFile;
  getFiles(
    options?: FirebaseStorageGetFilesOptions,
  ): Promise<[FirebaseStorageFile[]]>;
}

export interface FirebaseStorageFile {
  name: string;
  exists(): Promise<[boolean]>;
  delete(): Promise<any>;
  makePublic(): Promise<any>;
  createWriteStream(
    options?: FirebaseStorageWriteOptions,
  ): FirebaseStorageWriteStream;
  getSignedUrl(options: FirebaseStorageSignedUrlOptions): Promise<[string]>;
}

export interface FirebaseStorageWriteOptions {
  metadata?: {
    contentType?: string;
    [key: string]: any;
  };
  public?: boolean;
}

export interface FirebaseStorageWriteStream {
  on(event: 'error', callback: (error: Error) => void): void;
  on(event: 'finish', callback: () => void): void;
  end(data: Buffer): void;
}

export interface FirebaseStorageGetFilesOptions {
  prefix?: string;
  maxResults?: number;
  pageToken?: string;
}

export interface FirebaseStorageSignedUrlOptions {
  action: 'read' | 'write' | 'delete' | 'resumable';
  expires: Date | number | string;
}

export interface UploadResult {
  fileName: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface UploadError extends Error {
  code?: string;
  statusCode?: number;
}

export type AllowedImageMimeTypes = 'image/jpeg' | 'image/png' | 'image/webp';

export interface FileValidationOptions {
  allowedMimeTypes: AllowedImageMimeTypes[];
  maxSizeBytes?: number;
  minSizeBytes?: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  mimeType?: AllowedImageMimeTypes;
}

export interface ReplaceImageBody {
  previousUrl?: string;
}

export interface FirebaseStorageConfig {
  bucketName: string;
  projectId: string;
  defaultFolder: string;
}

export interface MigrationFile {
  originalPath: string;
  fileName: string;
  buffer: Buffer;
  stats: {
    size: number;
    mtime: Date;
  };
  mimeType: AllowedImageMimeTypes;
}

export interface MigrationResult {
  success: boolean;
  fileName?: string;
  url?: string;
  error?: string;
}

export interface MigrationSummary {
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  productsUpdated: number;
  errors: string[];
}

export interface StorageLogContext {
  operation: string;
  fileName?: string;
  folder?: string;
  size?: number;
  duration?: number;
}

export enum StorageFolders {
  IMAGES = 'images',
  MIGRATED_IMAGES = 'migrated-images',
  UPLOADS = 'uploads',
  TEMP = 'temp',
}

export enum FileOperations {
  UPLOAD = 'upload',
  DELETE = 'delete',
  GET_URL = 'getUrl',
  GET_SIGNED_URL = 'getSignedUrl',
  LIST_FILES = 'listFiles',
}

export const FIREBASE_STORAGE_CONSTANTS = {
  DEFAULT_EXPIRATION_HOURS: 24,
  MAX_FILE_SIZE_MB: 10,
  MIN_FILE_SIZE_BYTES: 1024, // 1KB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  PUBLIC_URL_BASE: 'https://storage.googleapis.com',
} as const;

export type AllowedMimeTypeTuple =
  typeof FIREBASE_STORAGE_CONSTANTS.ALLOWED_MIME_TYPES;

export type AllowedMimeType = AllowedMimeTypeTuple[number];
