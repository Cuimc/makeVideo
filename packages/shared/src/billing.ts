export type PointRecordType = 'recharge' | 'consume' | 'refund';

export interface BillingSummary {
  balance: number;
  totalRecharged: number;
  totalConsumed: number;
  totalRefunded: number;
}

export interface PointPackage {
  id: string;
  points: number;
  price: number;
  label: string;
}

export interface PointRecord {
  id: string;
  type: PointRecordType;
  label: string;
  points: number;
  createdAt: string;
  relatedTaskId?: string;
}

export interface RechargeRecord {
  id: string;
  packageId: string;
  packagePoints: number;
  amount: number;
  channel: 'wechat' | 'alipay';
  createdAt: string;
  status: 'success' | 'pending' | 'failed';
}
