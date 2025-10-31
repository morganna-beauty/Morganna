import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';
import { FileValidationService } from '../services/file-validation.service';
import {
  MulterFile,
  UploadResult,
  StorageFolders,
} from '../types/firebase-storage.types';
import { ReplaceImageBody } from '../types/firebase-storage.types';

@ApiTags('uploads')
@Controller('uploads')
export class UploadController {
  constructor(
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly fileValidationService: FileValidationService,
  ) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload an image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, WebP)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        filename: { type: 'string' },
        size: { type: 'number' },
        mimetype: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or file type',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: MulterFile): Promise<UploadResult> {
    const validation = this.fileValidationService.validateFile(file);

    if (!validation.isValid) {
      const errorMessages = validation.errors
        .map((err) => err.message)
        .join(', ');

      throw new BadRequestException(errorMessages);
    }

    try {
      return await this.firebaseStorageService.uploadFile(
        file,
        StorageFolders.IMAGES,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('image/replace')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Replace an existing image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'New image file (JPEG, PNG, WebP)',
        },
        previousUrl: {
          type: 'string',
          description: 'URL of the previous image to replace',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image replaced successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        filename: { type: 'string' },
        size: { type: 'number' },
        mimetype: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or file type',
  })
  @UseInterceptors(FileInterceptor('file'))
  async replaceImage(
    @UploadedFile() file: MulterFile,
    @Body() body: ReplaceImageBody,
  ): Promise<UploadResult> {
    const validation = this.fileValidationService.validateFile(file);

    if (!validation.isValid) {
      const errorMessages = validation.errors
        .map((err) => err.message)
        .join(', ');

      throw new BadRequestException(errorMessages);
    }

    try {
      if (body.previousUrl) {
        const previousFilename =
          this.firebaseStorageService.getFileNameFromStorage(body.previousUrl);

        if (previousFilename) {
          await this.firebaseStorageService.deleteFile(previousFilename);
        }
      }

      return await this.firebaseStorageService.uploadFile(
        file,
        StorageFolders.IMAGES,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
