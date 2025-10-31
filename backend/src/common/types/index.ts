// Re-export all types for easy importing
export * from './firebase-storage.types';

export {
  FileValidator,
  ValidationError,
  ValidationWarning,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationConfig,
  FILE_VALIDATION_CONSTANTS,
  FileMetadata,
  ImageDimensions,
  DetailedUploadResult,
  BatchUploadRequest,
  BatchUploadOptions,
  BatchUploadResult,
  FileUtils,
  AllowedExtension,
} from './file-validation.types';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
}

export interface AppConfig {
  firebase: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
  storage: {
    defaultBucket: string;
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
}

export type AsyncFunction<T extends any[] = any[], R = any> = (
  ...args: T
) => Promise<R>;

export type SyncFunction<T extends any[] = any[], R = any> = (...args: T) => R;

export interface StorageEvent {
  type: 'upload' | 'delete' | 'update';
  fileName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type StorageEventHandler = (event: StorageEvent) => void | Promise<void>;
