export const POINT_TRANSACTION_TYPE = {
  RECHARGE: 'RECHARGE',
  CONSUME: 'CONSUME',
  REFUND: 'REFUND',
  FREEZE: 'FREEZE',
  UNFREEZE: 'UNFREEZE',
} as const;

export type PointTransactionType =
  (typeof POINT_TRANSACTION_TYPE)[keyof typeof POINT_TRANSACTION_TYPE];
