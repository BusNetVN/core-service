import { Injectable } from '@nestjs/common';
import { toPublicOffice } from '../mappers/office.mapper.js';
import { OfficeRepository } from '../repository/office.repository.js';

@Injectable()
export class FindOfficeUseCase {
  constructor(private readonly offices: OfficeRepository) {}

  async execute(uuid: string) {
    return toPublicOffice(await this.offices.findByUuid(uuid));
  }
}
