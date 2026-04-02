import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtUserPayload {
  userId: string;
  phone?: string;
  nickname?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: JwtUserPayload;
    }>();
    const token = this.extractToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<
        JwtUserPayload & Record<string, unknown>
      >(token);

      if (typeof payload.userId !== 'string' || payload.userId.length === 0) {
        throw new UnauthorizedException();
      }

      request.user = {
        userId: payload.userId,
        phone: typeof payload.phone === 'string' ? payload.phone : undefined,
        nickname:
          typeof payload.nickname === 'string' ? payload.nickname : undefined,
      };

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractToken(authorization?: string) {
    if (!authorization) {
      return null;
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
