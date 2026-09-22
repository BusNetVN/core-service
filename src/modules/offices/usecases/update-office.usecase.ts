import { Injectable } from '@nestjs/common';
import { UpdateOfficeDto } from '../dto/update-office.dto.js';
import { Office } from '../entities/office.entity.js';
import {
  normalizeOfficeCode,
  normalizePhones,
  toPublicOffice,
} from '../mappers/office.mapper.js';
import { OfficeRepository } from '../repository/office.repository.js';

@Injectable()
export class UpdateOfficeUseCase {
  constructor(private readonly offices: OfficeRepository) {}

  async execute(uuid: string, dto: UpdateOfficeDto) {
    const office = await this.offices.findByUuid(uuid);
    if (dto.office_code) {
      await this.offices.assertUnique(
        office.company_id,
        normalizeOfficeCode(dto.office_code),
        office.id,
      );
    }
    this.offices.merge(office, this.definedFields(dto));
    const saved = await this.offices.save(office);
    saved.company = office.company;
    return toPublicOffice(saved);
  }

  private definedFields(dto: UpdateOfficeDto): Partial<Office> {
    const fields: Partial<Office> = {};
    (Object.keys(dto) as Array<keyof UpdateOfficeDto>).forEach((key) => {
      const value = dto[key];
      if (value === undefined) {
        return;
      }

      if (key === 'office_code' && typeof value === 'string') {
        fields.office_code = normalizeOfficeCode(value);
        return;
      }

      if (key === 'phones') {
        fields.phones = normalizePhones(value);
        return;
      }

      (fields as Record<string, unknown>)[key] = value;
    });
    return fields;
  }
}
