import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

function trim({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

function trimUpper({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

function emptyToNull({ value }: { value: unknown }) {
  if (value === '' || value === undefined) {
    return null;
  }
  return value;
}

export class CreateRouteDto {
  @IsUUID('4', { message: 'Nhà xe không hợp lệ.' })
  company_uuid: string;

  @Transform(trimUpper)
  @IsString()
  @MaxLength(32)
  route_code: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(180)
  name?: string;

  @Transform(trim)
  @IsString()
  @MaxLength(180)
  origin: string;

  @Transform(trim)
  @IsString()
  @MaxLength(180)
  destination: string;

  @Transform(emptyToNull)
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt({ message: 'Khoảng cách không hợp lệ.' })
  distance_km?: number | null;

  @Transform(emptyToNull)
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt({ message: 'Thời gian chạy không hợp lệ.' })
  duration_minutes?: number | null;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
