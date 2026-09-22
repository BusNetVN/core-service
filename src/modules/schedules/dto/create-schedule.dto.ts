import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { WeekdayMode } from '../enums/weekday-mode.enum.js';

function trim({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreateScheduleDto {
  @IsUUID('4', { message: 'Nhà xe không hợp lệ.' })
  company_uuid: string;

  @IsUUID('4', { message: 'Tuyến đường không hợp lệ.' })
  route_uuid: string;

  @IsUUID('4', { message: 'Sơ đồ ghế không hợp lệ.' })
  seat_map_uuid: string;

  @Transform(trim)
  @IsString()
  start_date: string;

  @Transform(trim)
  @IsString()
  end_date: string;

  @IsOptional()
  @IsEnum(WeekdayMode)
  weekday_mode?: WeekdayMode;

  @IsOptional()
  @IsArray()
  weekdays?: number[];

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
