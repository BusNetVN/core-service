import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AccountType, StaffRole } from '../constants/account.constant.js';
import { COMPANY_ADMIN_PERMISSIONS, COMPANY_STAFF_PERMISSIONS } from '../constants/api-permissions.js';
import { ErrorMessage } from '../constants/error-message.constant.js';
import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../constants/metadata.constant.js';
import type { AccessTokenPayload } from '../types/access-token-payload.js';
import { normalizePermissionCode } from '../utils/permission-code.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const required = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<
      Request & { user?: AccessTokenPayload }
    >();
    const user = request.user;
    if (!user?.sub) {
      throw new UnauthorizedException(ErrorMessage.MISSING_ACCESS_TOKEN);
    }

    if (user.account_type === AccountType.SYSTEM_ADMIN) {
      return true;
    }

    const granted = this.resolveGrantedCodes(user);
    const allowed = required.some((code) => granted.has(code));
    if (!allowed) {
      throw new ForbiddenException(ErrorMessage.FORBIDDEN_PERMISSION);
    }

    return true;
  }

  private resolveGrantedCodes(user: AccessTokenPayload) {
    const granted = new Set(
      (user.permissions ?? [])
        .map((code) => normalizePermissionCode(code))
        .filter(Boolean),
    );

    if (user.account_type === AccountType.COMPANY_STAFF) {
      const extras =
        user.staff_role === StaffRole.ADMIN
          ? COMPANY_ADMIN_PERMISSIONS
          : COMPANY_STAFF_PERMISSIONS;
      for (const code of extras) {
        granted.add(code);
      }
    }

    return granted;
  }
}
