import type { AuthSession, LoginPayload, UserProfile } from '@make-video/shared';
import type { HttpClient } from '../http';

export function createAuthModule(http: HttpClient) {
  return {
    login(payload: LoginPayload) {
      return http.post<AuthSession>('/api/auth/login', payload);
    },
    getProfile() {
      return http.get<UserProfile>('/api/auth/profile');
    },
  };
}
