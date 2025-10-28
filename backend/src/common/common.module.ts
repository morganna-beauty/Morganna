import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalUploadService } from './services/local-upload.service';
import { UploadController } from './controllers/upload.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [LocalUploadService],
  exports: [LocalUploadService],
})
export class CommonModule {}
