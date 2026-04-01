import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class QueueService {
  constructor(private readonly redisService: RedisService) {}

  createQueue(name: string) {
    return new Queue(name, {
      connection: this.redisService.getClient().duplicate({
        lazyConnect: true,
      }),
    });
  }
}
