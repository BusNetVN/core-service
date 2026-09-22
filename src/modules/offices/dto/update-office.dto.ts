import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOfficeDto } from './create-office.dto.js';

export class UpdateOfficeDto extends PartialType(
  OmitType(CreateOfficeDto, ['company_uuid'] as const),
) {}
