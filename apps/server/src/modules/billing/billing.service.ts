import type {
  BillingSummary,
  PointPackage,
  PointRecord,
  RechargeRecord,
} from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { paginateItems, type PagingInput } from '../../common/utils/pagination';
import { UsersService } from '../users/users.service';

const pointPackages: PointPackage[] = [
  {
    id: 'pack_100',
    points: 100,
    price: 10,
    label: '新手入门',
  },
  {
    id: 'pack_500',
    points: 500,
    price: 45,
    label: '高频创作',
  },
  {
    id: 'pack_1000',
    points: 1000,
    price: 90,
    label: '团队推荐',
  },
];

const pointRecordsByUser = new Map<string, PointRecord[]>([
  [
    'user_demo',
    [
      {
        id: 'record_1',
        type: 'recharge',
        label: '充值到账',
        points: 3000,
        createdAt: '2026-03-31T10:00:00.000Z',
      },
      {
        id: 'record_2',
        type: 'consume',
        label: '视频生成消耗',
        points: -320,
        createdAt: '2026-04-01T12:00:00.000Z',
        relatedTaskId: 'task_1',
      },
      {
        id: 'record_3',
        type: 'consume',
        label: '视频生成消耗',
        points: -320,
        createdAt: '2026-04-01T12:30:00.000Z',
        relatedTaskId: 'task_2',
      },
      {
        id: 'record_4',
        type: 'refund',
        label: '任务失败返还',
        points: 320,
        createdAt: '2026-04-01T12:35:00.000Z',
        relatedTaskId: 'task_2',
      },
    ],
  ],
]);

const rechargeRecordsByUser = new Map<string, RechargeRecord[]>([
  [
    'user_demo',
    [
      {
        id: 'recharge_1',
        packageId: 'pack_1000',
        packagePoints: 1000,
        amount: 90,
        channel: 'wechat',
        createdAt: '2026-03-31T10:00:00.000Z',
        status: 'success',
      },
      {
        id: 'recharge_2',
        packageId: 'pack_500',
        packagePoints: 500,
        amount: 45,
        channel: 'alipay',
        createdAt: '2026-04-01T09:30:00.000Z',
        status: 'success',
      },
    ],
  ],
]);

@Injectable()
export class BillingService {
  constructor(private readonly usersService: UsersService) {}

  async getSummary(userId: string): Promise<BillingSummary> {
    const profile = await this.usersService.getProfile(userId);
    const pointRecords = this.getPointRecordsSource(userId);

    const totalRecharged = pointRecords
      .filter((item) => item.type === 'recharge')
      .reduce((sum, item) => sum + item.points, 0);
    const totalConsumed = Math.abs(
      pointRecords
        .filter((item) => item.type === 'consume')
        .reduce((sum, item) => sum + item.points, 0),
    );
    const totalRefunded = pointRecords
      .filter((item) => item.type === 'refund')
      .reduce((sum, item) => sum + item.points, 0);

    return {
      balance: profile.pointBalance,
      totalRecharged,
      totalConsumed,
      totalRefunded,
    };
  }

  getPackages(): PointPackage[] {
    return pointPackages.slice();
  }

  getPointRecords(userId: string, paging: PagingInput) {
    return paginateItems(
      this.getPointRecordsSource(userId).slice().sort(sortByCreatedAtDesc),
      paging,
    );
  }

  getRechargeRecords(userId: string, paging: PagingInput) {
    return paginateItems(
      this.getRechargeRecordsSource(userId).slice().sort(sortByCreatedAtDesc),
      paging,
    );
  }

  private getPointRecordsSource(userId: string) {
    return pointRecordsByUser.get(userId) ?? [];
  }

  private getRechargeRecordsSource(userId: string) {
    return rechargeRecordsByUser.get(userId) ?? [];
  }
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(left: T, right: T) {
  return right.createdAt.localeCompare(left.createdAt);
}
