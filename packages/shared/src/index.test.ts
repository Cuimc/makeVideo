import { describe, expect, it } from 'vitest';
import {
  HEALTH_SERVICE_NAME,
  HEALTH_STATUS_OK,
  isHealthResponse,
} from './index';

describe('shared health contract', () => {
  it('accepts a valid health payload', () => {
    expect(
      isHealthResponse({
        status: HEALTH_STATUS_OK,
        service: HEALTH_SERVICE_NAME,
        timestamp: '2026-04-01T00:00:00.000Z',
      }),
    ).toBe(true);
  });

  it('rejects an invalid health payload', () => {
    expect(
      isHealthResponse({
        status: 'down',
        service: HEALTH_SERVICE_NAME,
      }),
    ).toBe(false);
  });
});
