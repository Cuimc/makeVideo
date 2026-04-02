import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import type { QueueName } from '../../common/constants/queue-names';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class QueueService {
  private readonly queues = new Map<QueueName, Queue>();

  constructor(private readonly redisService: RedisService) {}

  createQueue(name: QueueName) {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    const queue = new Queue(name, {
      connection: this.redisService.getClient().duplicate({
        lazyConnect: true,
      }),
    });

    this.queues.set(name, queue);

    return queue;
  }

  addJob<TData>(queueName: QueueName, jobName: string, data: TData) {
    return this.createQueue(queueName).add(jobName, data);
  }
}
