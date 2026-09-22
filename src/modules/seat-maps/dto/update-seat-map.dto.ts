import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSeatMapDto } from './create-seat-map.dto.js';

export class UpdateSeatMapDto extends PartialType(
  OmitType(CreateSeatMapDto, ['company_uuid'] as const),
) {}
