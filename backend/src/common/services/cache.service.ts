import { Injectable, Logger } from '@nestjs/common';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  cleanupInterval: number; // Cleanup interval in milliseconds
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  private cache = new Map<string, CacheEntry<any>>();

  private cleanupTimer: NodeJS.Timeout;

  private readonly config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
    cleanupInterval: 60 * 1000, // 1 minute
  };

  constructor() {
    this.startCleanupTimer();
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T>;

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);

      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      entries: Array.from(this.cache.keys()),
    };
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.logger.debug(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

// Decorator for caching method results
export function Cacheable(key: string, ttl?: number) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService: CacheService = this.cacheService;

      if (!cacheService) {
        return method.apply(this, args);
      }

      const cacheKey = `${key}:${JSON.stringify(args)}`;
      const cached = cacheService.get(cacheKey);

      if (cached !== null) {
        return cached;
      }

      const result = await method.apply(this, args);

      cacheService.set(cacheKey, result, ttl);

      return result;
    };
  };
}
