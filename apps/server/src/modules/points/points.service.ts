import { PointTransactionType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ERROR_CODES } from '../../common/constants/error-codes';
import { BusinessException } from '../../common/exceptions/business.exception';
import { PrismaService } from '../../prisma/prisma.service';

export interface FreezePointInput {
  userId: string;
  amount: number;
  businessType: string;
  businessId: string;
}

export interface SettlePointInput {
  userId: string;
  amount: number;
  businessType: string;
  businessId: string;
}

export interface PointBalanceSnapshot {
  availablePoints: number;
  frozenPoints: number;
}

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async freeze(input: FreezePointInput): Promise<PointBalanceSnapshot> {
    this.assertPositiveAmount(input.amount);

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.pointAccount.findUniqueOrThrow({
        where: { userId: input.userId },
      });

      if (account.availablePoints < input.amount) {
        throw new BusinessException(
          ERROR_CODES.INSUFFICIENT_POINTS,
          '积分不足',
        );
      }

      const updatedAccount = await tx.pointAccount.update({
        where: { id: account.id },
        data: {
          availablePoints: {
            decrement: input.amount,
          },
          frozenPoints: {
            increment: input.amount,
          },
        },
      });

      await tx.pointTransaction.create({
        data: {
          accountId: account.id,
          userId: input.userId,
          type: PointTransactionType.FREEZE,
          points: input.amount,
          balanceAfter: updatedAccount.availablePoints,
          relatedType: input.businessType,
          relatedId: input.businessId,
        },
      });

      return {
        availablePoints: updatedAccount.availablePoints,
        frozenPoints: updatedAccount.frozenPoints,
      };
    });
  }

  async consumeFrozen(input: SettlePointInput): Promise<PointBalanceSnapshot> {
    this.assertPositiveAmount(input.amount);

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.pointAccount.findUniqueOrThrow({
        where: { userId: input.userId },
      });

      if (account.frozenPoints < input.amount) {
        throw new BusinessException(ERROR_CODES.BAD_REQUEST, '冻结积分不足');
      }

      const updatedAccount = await tx.pointAccount.update({
        where: { id: account.id },
        data: {
          frozenPoints: {
            decrement: input.amount,
          },
        },
      });

      await tx.pointTransaction.create({
        data: {
          accountId: account.id,
          userId: input.userId,
          type: PointTransactionType.CONSUME,
          points: input.amount,
          balanceAfter: updatedAccount.availablePoints,
          relatedType: input.businessType,
          relatedId: input.businessId,
        },
      });

      return {
        availablePoints: updatedAccount.availablePoints,
        frozenPoints: updatedAccount.frozenPoints,
      };
    });
  }

  async refundFrozen(input: SettlePointInput): Promise<PointBalanceSnapshot> {
    this.assertPositiveAmount(input.amount);

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.pointAccount.findUniqueOrThrow({
        where: { userId: input.userId },
      });

      if (account.frozenPoints < input.amount) {
        throw new BusinessException(ERROR_CODES.BAD_REQUEST, '冻结积分不足');
      }

      const updatedAccount = await tx.pointAccount.update({
        where: { id: account.id },
        data: {
          availablePoints: {
            increment: input.amount,
          },
          frozenPoints: {
            decrement: input.amount,
          },
        },
      });

      await tx.pointTransaction.create({
        data: {
          accountId: account.id,
          userId: input.userId,
          type: PointTransactionType.REFUND,
          points: input.amount,
          balanceAfter: updatedAccount.availablePoints,
          relatedType: input.businessType,
          relatedId: input.businessId,
        },
      });

      return {
        availablePoints: updatedAccount.availablePoints,
        frozenPoints: updatedAccount.frozenPoints,
      };
    });
  }

  private assertPositiveAmount(amount: number) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BusinessException(ERROR_CODES.BAD_REQUEST, '积分变动值不合法');
    }
  }
}
