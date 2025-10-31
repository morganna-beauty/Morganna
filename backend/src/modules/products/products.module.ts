import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../common/firebase/firebase.module';
import { ProductsFirestoreService } from './products-firestore.service';
import { ProductsFirestoreController } from './products-firestore.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [ProductsFirestoreController],
  providers: [ProductsFirestoreService],
  exports: [ProductsFirestoreService],
})
export class ProductsModule {}
