import { Injectable } from '@nestjs/common';
import {
  HEALTH_SERVICE_NAME,
  HEALTH_STATUS_OK,
  type HealthResponse,
} from '@make-video/shared';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: HEALTH_STATUS_OK,
      service: HEALTH_SERVICE_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
