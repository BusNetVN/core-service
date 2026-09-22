import { Injectable } from '@nestjs/common';
import { UpdateSeatMapDto } from '../dto/update-seat-map.dto.js';
import { SeatMap } from '../entities/seat-map.entity.js';
import {
  normalizeSeatMapCode,
  normalizeSeatMapType,
  normalizeSeats,
  toPublicSeatMap,
} from '../mappers/seat-map.mapper.js';
import { SeatMapRepository } from '../repository/seat-map.repository.js';

@Injectable()
export class UpdateSeatMapUseCase {
  constructor(private readonly seatMaps: SeatMapRepository) {}

  async execute(uuid: string, dto: UpdateSeatMapDto) {
    const seatMap = await this.seatMaps.findByUuid(uuid);
    if (dto.seat_map_code) {
      await this.seatMaps.assertUnique(
        seatMap.company_id,
        normalizeSeatMapCode(dto.seat_map_code),
        seatMap.id,
      );
    }
    this.seatMaps.merge(seatMap, this.definedFields(dto, seatMap));
    const saved = await this.seatMaps.save(seatMap);
    saved.company = seatMap.company;
    return toPublicSeatMap(saved);
  }

  private definedFields(
    dto: UpdateSeatMapDto,
    current: SeatMap,
  ): Partial<SeatMap> {
    const fields: Partial<SeatMap> = {};
    (Object.keys(dto) as Array<keyof UpdateSeatMapDto>).forEach((key) => {
      const value = dto[key];
      if (value === undefined) {
        return;
      }

      if (key === 'seat_map_code' && typeof value === 'string') {
        fields.seat_map_code = normalizeSeatMapCode(value);
        return;
      }

      if (key === 'layout_type') {
        fields.layout_type = normalizeSeatMapType(value);
        return;
      }

      if (key === 'seats') {
        return;
      }

      (fields as Record<string, unknown>)[key] = value;
    });

    const floors = fields.floors ?? current.floors;
    const rows = fields.rows ?? current.rows;
    const columns = fields.columns ?? current.columns;
    if (
      dto.seats !== undefined ||
      dto.floors !== undefined ||
      dto.rows !== undefined ||
      dto.columns !== undefined
    ) {
      fields.seats = normalizeSeats(
        dto.seats ?? current.seats,
        floors,
        rows,
        columns,
      );
    }

    if (dto.name !== undefined) {
      fields.name =
        dto.name.trim() || fields.seat_map_code || current.seat_map_code;
    }

    return fields;
  }
}
