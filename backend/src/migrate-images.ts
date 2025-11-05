import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseStorageService } from './common/firebase/firebase-storage.service';
import { ProductsFirestoreService } from './modules/products/products-firestore.service';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import {
  MulterFile,
  StorageFolders,
  AllowedMimeType,
} from './common/types/firebase-storage.types';

async function migrateImages() {
  const logger = new Logger('ImageMigration');

  logger.log('🔄 Starting image migration to Firebase Storage...');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const storageService = app.get(FirebaseStorageService);
    const productsService = app.get(ProductsFirestoreService);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      logger.warn('⚠️  uploads directory does not exist, nothing to migrate');
      await app.close();

      return;
    }

    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file),
    );

    logger.log(`📁 Found ${imageFiles.length} images to migrate`);

    const migrationMap = new Map<string, string>();

    for (const filename of imageFiles) {
      try {
        const filePath = path.join(uploadsDir, filename);
        const fileBuffer = fs.readFileSync(filePath);
        const stats = fs.statSync(filePath);

        const mockFile: MulterFile = {
          fieldname: 'file',
          originalname: filename,
          encoding: '7bit',
          mimetype: getMimeType(filename),
          size: stats.size,
          buffer: fileBuffer,
        };

        logger.log(`📤 Uploading ${filename}...`);
        const result = await storageService.uploadFile(
          mockFile,
          StorageFolders.MIGRATED_IMAGES,
        );

        const oldUrl = `/uploads/${filename}`;

        migrationMap.set(oldUrl, result.url);

        logger.log(`✅ ${filename} uploaded to Firebase Storage`);
      } catch (error) {
        logger.error(`❌ Failed to upload ${filename}:`, error.message);
      }
    }

    logger.log('🔄 Updating product image references...');

    const products = await productsService.findAll();
    let updatedCount = 0;

    for (const product of products) {
      if (product.imageSrc && migrationMap.has(product.imageSrc)) {
        try {
          await productsService.update(product.id.toString(), {
            imageSrc: migrationMap.get(product.imageSrc),
          });
          updatedCount++;
          logger.log(`✅ Updated product ${product.id} image reference`);
        } catch (error) {
          logger.error(
            `❌ Failed to update product ${product.id}:`,
            error.message,
          );
        }
      }
    }

    logger.log(`🎉 Migration completed!`);
    logger.log(`📊 Statistics:`);
    logger.log(`   - Images migrated: ${migrationMap.size}`);
    logger.log(`   - Products updated: ${updatedCount}`);
    logger.log(`   - Total products: ${products.length}`);

    await app.close();
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

function getMimeType(filename: string): AllowedMimeType {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // fallback para archivos desconocidos
  }
}

if (require.main === module) {
  migrateImages()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}
