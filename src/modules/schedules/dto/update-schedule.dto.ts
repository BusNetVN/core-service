import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto.js';

export class UpdateScheduleDto extends PartialType(
  OmitType(CreateScheduleDto, ['company_uuid'] as const),
) {}
