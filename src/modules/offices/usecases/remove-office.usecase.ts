import { Injectable } from '@nestjs/common';
import { normalizeOfficeCode } from '../mappers/office.mapper.js';
import { OfficeRepository } from '../repository/office.repository.js';

@Injectable()
export class RemoveOfficeUseCase {
  constructor(private readonly offices: OfficeRepository) {}

  async execute(uuid: string) {
    const office = await this.offices.findByUuid(uuid);
    await this.offices.remove(office);
    return {
      id: office.uuid,
      office_code: normalizeOfficeCode(office.office_code),
    };
  }
}
