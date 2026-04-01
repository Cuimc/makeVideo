import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { getAppEnv } from '../common/config/app-env';

@Injectable()
export class RedisService {
  private client: Redis | null = null;

  getClient() {
    if (!this.client) {
      this.client = new Redis(getAppEnv().redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: null,
      });
    }

    return this.client;
  }
}
