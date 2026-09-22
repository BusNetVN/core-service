import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AccountType } from '../constants/account.constant.js';
import { ErrorMessage } from '../constants/error-message.constant.js';
import type { AccessTokenPayload } from '../types/access-token-payload.js';

export function companyUuidFromToken(
  user: AccessTokenPayload,
  requested?: string | null,
) {
  if (user.account_type === AccountType.SYSTEM_ADMIN) {
    return requested ?? undefined;
  }

  if (user.account_type !== AccountType.COMPANY_STAFF || !user.company_uuid) {
    throw new ForbiddenException(ErrorMessage.FORBIDDEN_PERMISSION);
  }

  if (requested && requested !== user.company_uuid) {
    throw new ForbiddenException(ErrorMessage.FORBIDDEN_PERMISSION);
  }

  return user.company_uuid;
}

export function requiredCompanyUuidFromToken(
  user: AccessTokenPayload,
  requested?: string | null,
) {
  const companyUuid = companyUuidFromToken(user, requested);
  if (!companyUuid) {
    throw new BadRequestException('Vui lòng chọn nhà xe.');
  }
  return companyUuid;
}

export function assertCompanyResource(
  user: AccessTokenPayload,
  resourceCompanyUuid?: string | null,
) {
  if (user.account_type === AccountType.SYSTEM_ADMIN) {
    return;
  }

  if (
    user.account_type !== AccountType.COMPANY_STAFF ||
    !user.company_uuid ||
    resourceCompanyUuid !== user.company_uuid
  ) {
    throw new ForbiddenException(ErrorMessage.FORBIDDEN_PERMISSION);
  }
}
