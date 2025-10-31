import { Module } from '@nestjs/common';
import { FirebaseConfig } from './firebase.config';
import { FirebaseService } from './firebase.service';
import { FirebaseStorageService } from './firebase-storage.service';

@Module({
  providers: [FirebaseConfig, FirebaseService, FirebaseStorageService],
  exports: [FirebaseService, FirebaseConfig, FirebaseStorageService],
})
export class FirebaseModule {}
