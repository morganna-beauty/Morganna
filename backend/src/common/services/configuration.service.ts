import { Injectable } from '@nestjs/common';

export interface AppConfig {
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
  cache: {
    defaultTTL: number;
    maxSize: number;
  };
  search: {
    minSearchLength: number;
    maxResults: number;
  };
  upload: {
    maxFileSize: number;
    allowedMimeTypes: string[];
    maxFilesPerRequest: number;
  };
  validation: {
    passwordMinLength: number;
    usernameMinLength: number;
    usernameMaxLength: number;
  };
}

@Injectable()
export class ConfigurationService {
  private readonly config: AppConfig = {
    pagination: {
      defaultLimit: 20,
      maxLimit: 100,
    },
    cache: {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 1000,
    },
    search: {
      minSearchLength: 2,
      maxResults: 1000,
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFilesPerRequest: 5,
    },
    validation: {
      passwordMinLength: 8,
      usernameMinLength: 3,
      usernameMaxLength: 30,
    },
  };

  get pagination() {
    return this.config.pagination;
  }

  get cache() {
    return this.config.cache;
  }

  get search() {
    return this.config.search;
  }

  get upload() {
    return this.config.upload;
  }

  get validation() {
    return this.config.validation;
  }

  getFullConfig(): AppConfig {
    return { ...this.config };
  }

  updateConfig(partialConfig: Partial<AppConfig>): void {
    Object.assign(this.config, partialConfig);
  }
}
