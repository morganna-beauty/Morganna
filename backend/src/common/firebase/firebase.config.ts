import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  private app: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          'Firebase configuration is missing required environment variables',
        );
      }

      // Replace escaped newlines with actual newlines
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey,
        }),
        projectId,
      });
    } else {
      this.app = admin.app();
    }
  }

  getApp(): admin.app.App {
    return this.app;
  }

  getFirestore(): admin.firestore.Firestore {
    return this.app.firestore();
  }

  getStorage(): admin.storage.Storage {
    return this.app.storage();
  }
}
