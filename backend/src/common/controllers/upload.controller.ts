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
import { LocalUploadService } from '../services/local-upload.service';
import { UploadResult } from '../interfaces/upload.interface';

@ApiTags('uploads')
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: LocalUploadService) {}

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
  async uploadImage(@UploadedFile() file: any): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      return await this.uploadService.uploadImage(file);
    } catch (error) {
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
    @UploadedFile() file: any,
    @Body() body: { previousUrl?: string },
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      if (body.previousUrl) {
        const previousFilename = this.uploadService.extractFilenameFromUrl(
          body.previousUrl,
        );

        if (previousFilename) {
          await this.uploadService.deleteImage(previousFilename);
        }
      }

      return await this.uploadService.uploadImage(file);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
