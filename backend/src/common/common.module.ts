import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './controllers/upload.controller';
import { StorageDiagnosticsController } from './controllers/storage-diagnostics.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { FileValidationService } from './services/file-validation.service';
import { CacheService } from './services/cache.service';
import { ConfigurationService } from './services/configuration.service';

@Module({
  imports: [ConfigModule, FirebaseModule],
  controllers: [UploadController, StorageDiagnosticsController],
  providers: [FileValidationService, CacheService, ConfigurationService],
  exports: [
    FirebaseModule,
    FileValidationService,
    CacheService,
    ConfigurationService,
  ],
})
export class CommonModule {}
