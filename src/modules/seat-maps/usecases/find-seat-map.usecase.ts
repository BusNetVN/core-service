import { Injectable } from '@nestjs/common';
import { toPublicSeatMap } from '../mappers/seat-map.mapper.js';
import { SeatMapRepository } from '../repository/seat-map.repository.js';

@Injectable()
export class FindSeatMapUseCase {
  constructor(private readonly seatMaps: SeatMapRepository) {}

  async execute(uuid: string) {
    return toPublicSeatMap(await this.seatMaps.findByUuid(uuid));
  }
}
