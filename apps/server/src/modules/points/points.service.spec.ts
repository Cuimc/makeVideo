import { PrismaService } from '../../prisma/prisma.service';
import { PointsService } from './points.service';

describe('PointsService', () => {
  it('freezes points before async task submission', async () => {
    let account = {
      id: 'account-1',
      userId: 'user-1',
      availablePoints: 3000,
      frozenPoints: 0,
    };
    const pointTransactionCreate = jest.fn();
    const prisma = {
      $transaction: jest.fn(
        async (
          callback: (tx: {
            pointAccount: {
              findUniqueOrThrow: typeof pointAccountFindUniqueOrThrow;
              update: typeof pointAccountUpdate;
            };
            pointTransaction: {
              create: typeof pointTransactionCreate;
            };
          }) => Promise<unknown>,
        ) =>
          callback({
            pointAccount: {
              findUniqueOrThrow: pointAccountFindUniqueOrThrow,
              update: pointAccountUpdate,
            },
            pointTransaction: {
              create: pointTransactionCreate,
            },
          }),
      ),
    } as unknown as PrismaService;

    async function pointAccountFindUniqueOrThrow() {
      return account;
    }

    async function pointAccountUpdate(args: {
      data: {
        availablePoints: { decrement: number };
        frozenPoints: { increment: number };
      };
    }) {
      account = {
        ...account,
        availablePoints:
          account.availablePoints - args.data.availablePoints.decrement,
        frozenPoints: account.frozenPoints + args.data.frozenPoints.increment,
      };

      return account;
    }

    const service = new PointsService(prisma);

    const result = await service.freeze({
      userId: 'user-1',
      amount: 200,
      businessType: 'VIDEO_TASK',
      businessId: 'task-1',
    });

    expect(result.availablePoints).toBe(2800);
    expect(result.frozenPoints).toBe(200);
    expect(pointTransactionCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        accountId: 'account-1',
        userId: 'user-1',
        type: 'FREEZE',
        points: 200,
        balanceAfter: 2800,
        relatedType: 'VIDEO_TASK',
        relatedId: 'task-1',
      }),
    });
  });
});
