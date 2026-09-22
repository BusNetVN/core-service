import { Injectable } from '@nestjs/common';
import { toPublicSchedule } from '../mappers/schedule.mapper.js';
import { ScheduleRepository } from '../repository/schedule.repository.js';

@Injectable()
export class FindScheduleUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(uuid: string) {
    return toPublicSchedule(await this.schedules.findByUuid(uuid));
  }
}
