import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessage } from '../constants/error-message.constant.js';
import type { AccessTokenPayload } from '../types/access-token-payload.js';
import { parsePermissionCodes } from '../utils/permission-code.js';

export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  jwtConfig() {
    return this.config.getOrThrow<JwtConfig>('jwt');
  }

  async verifyAccess(token: string): Promise<AccessTokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync<{
        sub?: string;
        username?: string;
        account_type?: string;
        staff_role?: string | null;
        company_uuid?: string | null;
        permissions?: unknown;
        type?: string;
      }>(token, {
        secret: this.jwtConfig().secret,
      });
      if (payload.type === 'refresh' || !payload.sub) {
        throw new UnauthorizedException(ErrorMessage.INVALID_ACCESS_TOKEN);
      }
      return {
        sub: payload.sub,
        username: payload.username ?? '',
        account_type: payload.account_type ?? '',
        staff_role: payload.staff_role ?? null,
        company_uuid: payload.company_uuid ?? null,
        permissions: parsePermissionCodes(payload.permissions),
        type: 'access',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(ErrorMessage.INVALID_ACCESS_TOKEN);
    }
  }
}
