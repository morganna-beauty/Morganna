import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';
import { FirebaseConfig } from '../firebase/firebase.config';

@ApiTags('storage')
@Controller('storage')
export class StorageDiagnosticsController {
  constructor(
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly firebaseConfig: FirebaseConfig,
  ) {}

  @Get('diagnostics')
  @ApiResponse({
    status: 200,
    description: 'Firebase Storage diagnostics information',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        projectId: { type: 'string' },
        bucketName: { type: 'string' },
        bucketExists: { type: 'boolean' },
        error: { type: 'string' },
      },
    },
  })
  async getDiagnostics() {
    try {
      const app = this.firebaseConfig.getApp();
      const projectId = app.options.projectId;
      const bucketName = app.options.storageBucket || `${projectId}.appspot.com`;

      const storage = this.firebaseConfig.getStorage();
      const bucket = storage.bucket(bucketName);

      let bucketExists = false;
      let error = null;

      try {
        const [exists] = await bucket.exists();

        bucketExists = exists;
      } catch (bucketError: any) {
        error = bucketError.message;
      }

      return {
        status: bucketExists ? 'OK' : 'ERROR',
        projectId,
        bucketName,
        bucketExists,
        error,
        instructions: bucketExists
          ? 'Firebase Storage is ready to use'
          : 'Please enable Firebase Storage in your Firebase Console',
        consoleUrl: `https://console.firebase.google.com/project/${projectId}/storage`,
      };
    } catch (error: any) {
      return {
        status: 'ERROR',
        error: error.message,
        instructions:
          'Check your Firebase configuration and ensure Storage is enabled',
      };
    }
  }

  @Get('test-connection')
  @ApiResponse({
    status: 200,
    description: 'Test Firebase Storage connection',
  })
  async testConnection() {
    try {
      await this.firebaseStorageService.listFiles('test');

      return {
        status: 'SUCCESS',
        message: 'Firebase Storage connection is working',
      };
    } catch (error: any) {
      return {
        status: 'ERROR',
        message: 'Firebase Storage connection failed',
        error: error.message,
        solution: 'Please enable Firebase Storage in your Firebase Console',
      };
    }
  }
}
