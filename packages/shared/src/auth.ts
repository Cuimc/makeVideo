export interface LoginPayload {
  phone: string;
  code: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  maskedPhone: string;
  nickname: string;
  pointBalance: number;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  profile: UserProfile;
}
