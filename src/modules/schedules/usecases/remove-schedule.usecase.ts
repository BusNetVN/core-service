import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository.js';

@Injectable()
export class RemoveScheduleUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(uuid: string) {
    const schedule = await this.schedules.findByUuid(uuid);
    await this.schedules.remove(schedule);
    return { id: schedule.uuid };
  }
}
