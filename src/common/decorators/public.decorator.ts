import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/metadata.constant.js';

export { IS_PUBLIC_KEY };

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
