import { describe, expect, it } from 'vitest';
import {
  PROJECT_STATUS_OPTIONS,
  REFERENCE_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
} from './status';

describe('status catalogs', () => {
  it('covers all project statuses used by web flows', () => {
    expect(PROJECT_STATUS_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'created' }),
        expect.objectContaining({ value: 'script_pending_confirm' }),
        expect.objectContaining({ value: 'completed' }),
      ]),
    );
  });

  it('keeps task and reference statuses explicit', () => {
    expect(TASK_STATUS_OPTIONS.some((item) => item.value === 'partial_success')).toBe(true);
    expect(REFERENCE_STATUS_OPTIONS.some((item) => item.value === 'analyzing')).toBe(true);
  });
});
