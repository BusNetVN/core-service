import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ErrorMessage } from '../constants/error-message.constant.js';
import { IS_PUBLIC_KEY } from '../constants/metadata.constant.js';
import { TokenService } from '../services/token.service.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokens: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const header = request.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(ErrorMessage.MISSING_ACCESS_TOKEN);
    }

    const payload = await this.tokens.verifyAccess(token);
    request.user = {
      ...payload,
      permissions: payload.permissions ?? [],
    };
    return true;
  }
}
