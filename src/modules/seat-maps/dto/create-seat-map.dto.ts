import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { SeatMapType } from '../enums/seat-map-type.enum.js';

function trim({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

function trimUpper({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

function toInt({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  const next = Number(value);
  return Number.isFinite(next) ? next : value;
}

export class CreateSeatMapDto {
  @IsUUID('4', { message: 'Nhà xe không hợp lệ.' })
  company_uuid: string;

  @Transform(trimUpper)
  @IsString()
  @MaxLength(32)
  seat_map_code: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(180)
  name?: string;

  @IsOptional()
  @IsEnum(SeatMapType)
  layout_type?: SeatMapType;

  @Transform(toInt)
  @IsOptional()
  @IsInt()
  floors?: number;

  @Transform(toInt)
  @IsOptional()
  @IsInt()
  rows?: number;

  @Transform(toInt)
  @IsOptional()
  @IsInt()
  columns?: number;

  @IsOptional()
  @IsArray()
  seats?: unknown[];

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
