export const REFERENCE_STATUS = {
  PENDING: 'PENDING',
  ANALYZING: 'ANALYZING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type ReferenceStatus =
  (typeof REFERENCE_STATUS)[keyof typeof REFERENCE_STATUS];
