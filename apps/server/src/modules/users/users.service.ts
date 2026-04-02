import type { UserProfile } from '@make-video/shared';
import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exceptions/business.exception';

const DEMO_USER: UserProfile = {
  id: 'user_demo',
  phone: '13800138000',
  maskedPhone: '138****8000',
  nickname: 'Demo User',
  pointBalance: 3000,
  createdAt: '2026-04-01T00:00:00.000Z',
};

const usersById = new Map<string, UserProfile>([[DEMO_USER.id, DEMO_USER]]);
const userIdsByPhone = new Map<string, string>([[DEMO_USER.phone, DEMO_USER.id]]);

@Injectable()
export class UsersService {
  async findOrCreateByPhone(phone: string): Promise<UserProfile> {
    const existingUserId = userIdsByPhone.get(phone);

    if (existingUserId) {
      return this.getProfile(existingUserId);
    }

    const id = `user_${phone}`;
    const profile: UserProfile = {
      id,
      phone,
      maskedPhone: maskPhone(phone),
      nickname: `User ${phone.slice(-4)}`,
      pointBalance: 1000,
      createdAt: new Date().toISOString(),
    };

    usersById.set(id, profile);
    userIdsByPhone.set(phone, id);

    return profile;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const profile = usersById.get(userId);

    if (!profile) {
      throw new BusinessException(404, '用户不存在', 404);
    }

    return profile;
  }
}

function maskPhone(phone: string) {
  if (phone.length !== 11) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
