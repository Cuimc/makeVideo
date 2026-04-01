export const HEALTH_STATUS_OK = 'ok';
export const HEALTH_SERVICE_NAME = 'make-video-server';

export interface HealthResponse {
  status: typeof HEALTH_STATUS_OK;
  service: typeof HEALTH_SERVICE_NAME;
  timestamp: string;
}

export function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.status === HEALTH_STATUS_OK &&
    record.service === HEALTH_SERVICE_NAME &&
    typeof record.timestamp === 'string'
  );
}
