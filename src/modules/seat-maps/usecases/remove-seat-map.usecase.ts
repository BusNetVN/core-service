import { Injectable } from '@nestjs/common';
import { normalizeSeatMapCode } from '../mappers/seat-map.mapper.js';
import { SeatMapRepository } from '../repository/seat-map.repository.js';

@Injectable()
export class RemoveSeatMapUseCase {
  constructor(private readonly seatMaps: SeatMapRepository) {}

  async execute(uuid: string) {
    const seatMap = await this.seatMaps.findByUuid(uuid);
    await this.seatMaps.remove(seatMap);
    return {
      id: seatMap.uuid,
      seat_map_code: normalizeSeatMapCode(seatMap.seat_map_code),
    };
  }
}
