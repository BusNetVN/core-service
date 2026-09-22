import { SetMetadata } from '@nestjs/common';
import { REQUIRED_PERMISSIONS_KEY } from '../constants/metadata.constant.js';
import { normalizePermissionCode } from '../utils/permission-code.js';

export { REQUIRED_PERMISSIONS_KEY };

export const RequirePermission = (...codes: string[]) =>
  SetMetadata(
    REQUIRED_PERMISSIONS_KEY,
    codes.map((code) => normalizePermissionCode(code)).filter(Boolean),
  );
