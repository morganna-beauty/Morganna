import { Injectable } from '@nestjs/common';
import {
  FileValidator,
  FileValidationResult as FileValidationResultType,
  ValidationError,
  ValidationWarning,
  ValidationErrorCode,
  ValidationWarningCode,
  ValidationConfig,
  FILE_VALIDATION_CONSTANTS,
} from '../types/file-validation.types';
import {
  MulterFile,
  AllowedImageMimeTypes,
  FIREBASE_STORAGE_CONSTANTS,
} from '../types/firebase-storage.types';

@Injectable()
export class FileValidationService implements FileValidator {
  private readonly config: ValidationConfig = {
    maxSizeBytes: FIREBASE_STORAGE_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024,
    minSizeBytes: FIREBASE_STORAGE_CONSTANTS.MIN_FILE_SIZE_BYTES,
    allowedMimeTypes: [
      ...FIREBASE_STORAGE_CONSTANTS.ALLOWED_MIME_TYPES,
    ] as AllowedImageMimeTypes[],
    requireOriginalName: true,
    allowEmptyFiles: false,
  };

  validateFile(file: MulterFile): FileValidationResultType {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!file) {
      errors.push({
        field: 'file',
        message: 'No file provided',
        code: ValidationErrorCode.NO_FILE_PROVIDED,
      });

      return {
        isValid: false,
        errors,
        warnings,
      };
    }

    // Validar nombre de archivo
    if (!file.originalname || file.originalname.trim().length === 0) {
      errors.push({
        field: 'originalname',
        message: 'File must have a valid name',
        code: ValidationErrorCode.INVALID_FILE_NAME,
      });
    }

    // Validar tipo MIME
    if (!this.validateMimeType(file.mimetype)) {
      errors.push({
        field: 'mimetype',
        message: `Invalid file type. Allowed types: ${this.config.allowedMimeTypes.join(', ')}`,
        code: ValidationErrorCode.INVALID_MIME_TYPE,
      });
    }

    // Validar tamaño
    if (!this.validateSize(file.size)) {
      if (file.size > this.config.maxSizeBytes) {
        errors.push({
          field: 'size',
          message: `File too large. Maximum size: ${this.config.maxSizeBytes / (1024 * 1024)}MB`,
          code: ValidationErrorCode.FILE_TOO_LARGE,
        });
      } else if (file.size < this.config.minSizeBytes) {
        errors.push({
          field: 'size',
          message: `File too small. Minimum size: ${this.config.minSizeBytes} bytes`,
          code: ValidationErrorCode.FILE_TOO_SMALL,
        });
      }
    }

    // Advertencias por tamaño grande
    const largeSizeThreshold = this.config.maxSizeBytes * 0.8; // 80% del máximo

    if (file.size > largeSizeThreshold) {
      warnings.push({
        field: 'size',
        message: 'File is relatively large and may take longer to upload',
        code: ValidationWarningCode.LARGE_FILE_SIZE,
      });
    }

    // Validar buffer
    if (!file.buffer || file.buffer.length === 0) {
      errors.push({
        field: 'buffer',
        message: 'File appears to be corrupted or empty',
        code: ValidationErrorCode.CORRUPTED_FILE,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateMimeType(mimeType: string): boolean {
    return this.config.allowedMimeTypes.includes(
      mimeType as AllowedImageMimeTypes,
    );
  }

  validateSize(size: number): boolean {
    return size >= this.config.minSizeBytes && size <= this.config.maxSizeBytes;
  }

  getValidationConfig(): ValidationConfig {
    return { ...this.config };
  }

  updateValidationConfig(newConfig: Partial<ValidationConfig>): void {
    Object.assign(this.config, newConfig);
  }

  isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  getFileExtensionFromMimeType(mimeType: string): string | null {
    const mimeTypeMap = FILE_VALIDATION_CONSTANTS.MIME_TYPE_MAP as Record<
      string,
      readonly string[]
    >;
    const extensions = mimeTypeMap[mimeType];

    return extensions ? extensions[0] : null;
  }

  validateFileExtension(fileName: string, mimeType: string): boolean {
    const fileExtension = this.extractFileExtension(fileName);
    const mimeTypeKey =
      mimeType as keyof typeof FILE_VALIDATION_CONSTANTS.MIME_TYPE_MAP;
    const expectedExtensions =
      FILE_VALIDATION_CONSTANTS.MIME_TYPE_MAP[mimeTypeKey];

    if (!expectedExtensions) {
      return false;
    }

    return expectedExtensions.some((ext) => ext === fileExtension);
  }

  private extractFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');

    return lastDotIndex !== -1
      ? fileName.substring(lastDotIndex).toLowerCase()
      : '';
  }
}
