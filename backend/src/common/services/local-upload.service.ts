import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUploadService, UploadResult } from '../interfaces/upload.interface';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

@Injectable()
export class LocalUploadService implements IUploadService {
  private readonly uploadsPath: string;

  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadsPath = path.join(
      process.cwd(),
      'public',
      'uploads',
      'products',
    );
    this.baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3001',
    );
  }

  async uploadImage(file: any): Promise<UploadResult> {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG and WebP are allowed.',
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    const fileExtension = path.extname(file.originalname);

    const timestamp = Date.now();

    const randomHash = crypto.randomBytes(8).toString('hex');

    const filename = `${timestamp}-${randomHash}${fileExtension}`;

    await this.ensureDirectoryExists();

    const filePath = path.join(this.uploadsPath, filename);

    await fs.writeFile(filePath, file.buffer);

    return {
      url: this.getImageUrl(filename),
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteImage(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadsPath, filename);

      await fs.access(filePath);

      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getImageUrl(filename: string): string {
    return `${this.baseUrl}/uploads/products/${filename}`;
  }

  extractFilenameFromUrl(url: string): string {
    if (!url) return '';

    const urlParts = url.split('/');

    return urlParts[urlParts.length - 1] || '';
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.uploadsPath);
    } catch {
      await fs.mkdir(this.uploadsPath, { recursive: true });
    }
  }
}
