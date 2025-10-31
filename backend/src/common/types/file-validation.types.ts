import { AllowedImageMimeTypes, MulterFile } from './firebase-storage.types';

// Tipos para validación de archivos
export interface FileValidator {
  validateFile(file: MulterFile): FileValidationResult;
  validateMimeType(mimeType: string): boolean;
  validateSize(size: number): boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: ValidationWarningCode;
}

export enum ValidationErrorCode {
  INVALID_MIME_TYPE = 'INVALID_MIME_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TOO_SMALL = 'FILE_TOO_SMALL',
  NO_FILE_PROVIDED = 'NO_FILE_PROVIDED',
  INVALID_FILE_NAME = 'INVALID_FILE_NAME',
  CORRUPTED_FILE = 'CORRUPTED_FILE',
}

export enum ValidationWarningCode {
  LARGE_FILE_SIZE = 'LARGE_FILE_SIZE',
  UNCOMMON_FORMAT = 'UNCOMMON_FORMAT',
}

// Tipos para configuración de validación
export interface ValidationConfig {
  maxSizeBytes: number;
  minSizeBytes: number;
  allowedMimeTypes: AllowedImageMimeTypes[];
  requireOriginalName: boolean;
  allowEmptyFiles: boolean;
}

// Tipos para metadatos de archivo
export interface FileMetadata {
  originalName: string;
  size: number;
  mimeType: AllowedImageMimeTypes;
  encoding: string;
  uploadedAt: Date;
  checksum?: string;
  dimensions?: ImageDimensions;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// Tipos para respuesta de API detallada
export interface DetailedUploadResult {
  success: boolean;
  file?: {
    fileName: string;
    originalName: string;
    url: string;
    publicUrl: string;
    metadata: FileMetadata;
  };
  validation: FileValidationResult;
  uploadDuration?: number;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

// Tipos para batch operations
export interface BatchUploadRequest {
  files: MulterFile[];
  folder: string;
  options?: BatchUploadOptions;
}

export interface BatchUploadOptions {
  stopOnFirstError: boolean;
  maxConcurrentUploads: number;
  generateThumbnails: boolean;
}

export interface BatchUploadResult {
  totalFiles: number;
  successfulUploads: DetailedUploadResult[];
  failedUploads: DetailedUploadResult[];
  summary: {
    successCount: number;
    errorCount: number;
    totalSizeBytes: number;
    totalDurationMs: number;
  };
}

// Tipos para utilidades de archivo
export interface FileUtils {
  extractExtension(fileName: string): string;
  generateFileName(originalName: string, folder: string): string;
  isImageFile(mimeType: string): boolean;
  calculateChecksum(buffer: Buffer): string;
  getImageDimensions(buffer: Buffer): Promise<ImageDimensions>;
}

// Constantes de validación tipadas
export const FILE_VALIDATION_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_FILE_SIZE: 1024, // 1KB
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'] as const,
  MIME_TYPE_MAP: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  } as const,
} as const;

export type AllowedExtension =
  (typeof FILE_VALIDATION_CONSTANTS.ALLOWED_EXTENSIONS)[number];
