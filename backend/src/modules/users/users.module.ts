import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../common/firebase/firebase.module';
import { UsersFirestoreService } from './users-firestore.service';
import { UsersFirestoreController } from './users-firestore.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [UsersFirestoreController],
  providers: [UsersFirestoreService],
  exports: [UsersFirestoreService],
})
export class UsersModule {}
