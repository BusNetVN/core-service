import { BadRequestException, Injectable, ParseUUIDPipe } from '@nestjs/common';
import { ErrorMessage } from '../constants/error-message.constant.js';

@Injectable()
export class UuidParamPipe extends ParseUUIDPipe {
  constructor() {
    super({
      version: '4',
      exceptionFactory: () => new BadRequestException(ErrorMessage.INVALID_UUID),
    });
  }
}
