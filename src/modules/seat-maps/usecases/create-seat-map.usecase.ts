import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../companies/repository/company.repository.js';
import { CreateSeatMapDto } from '../dto/create-seat-map.dto.js';
import {
  normalizeSeatMapCode,
  normalizeSeatMapType,
  normalizeSeats,
  toPublicSeatMap,
} from '../mappers/seat-map.mapper.js';
import { SeatMapRepository } from '../repository/seat-map.repository.js';

function positiveOr(value: number | undefined, fallback: number) {
  return value && value > 0 ? value : fallback;
}

@Injectable()
export class CreateSeatMapUseCase {
  constructor(
    private readonly seatMaps: SeatMapRepository,
    private readonly companies: CompanyRepository,
  ) {}

  async execute(dto: CreateSeatMapDto) {
    const company = await this.companies.findByUuid(dto.company_uuid);
    const seatMapCode = normalizeSeatMapCode(dto.seat_map_code);
    await this.seatMaps.assertUnique(company.id, seatMapCode);
    const floors = positiveOr(dto.floors, 1);
    const rows = positiveOr(dto.rows, 10);
    const columns = positiveOr(dto.columns, 4);
    const seats = normalizeSeats(dto.seats, floors, rows, columns);
    const name = dto.name?.trim() || seatMapCode;
    const seatMap = this.seatMaps.create({
      uuid: crypto.randomUUID(),
      company_id: company.id,
      company,
      seat_map_code: seatMapCode,
      name,
      layout_type: normalizeSeatMapType(dto.layout_type),
      floors,
      rows,
      columns,
      seats,
      note: dto.note?.trim() ?? '',
      status: dto.status ?? true,
    });
    const saved = await this.seatMaps.save(seatMap);
    saved.company = company;
    return toPublicSeatMap(saved);
  }
}
