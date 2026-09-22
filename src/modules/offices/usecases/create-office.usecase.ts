import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../companies/repository/company.repository.js';
import { CreateOfficeDto } from '../dto/create-office.dto.js';
import {
  normalizeOfficeCode,
  normalizePhones,
  toPublicOffice,
} from '../mappers/office.mapper.js';
import { OfficeRepository } from '../repository/office.repository.js';

@Injectable()
export class CreateOfficeUseCase {
  constructor(
    private readonly offices: OfficeRepository,
    private readonly companies: CompanyRepository,
  ) {}

  async execute(dto: CreateOfficeDto) {
    const company = await this.companies.findByUuid(dto.company_uuid);
    const officeCode = normalizeOfficeCode(dto.office_code);
    await this.offices.assertUnique(company.id, officeCode);
    const office = this.offices.create({
      uuid: crypto.randomUUID(),
      company_id: company.id,
      company,
      office_code: officeCode,
      name: dto.name,
      address: dto.address,
      phones: normalizePhones(dto.phones),
      note: dto.note?.trim() ?? '',
    });
    const saved = await this.offices.save(office);
    saved.company = company;
    return toPublicOffice(saved);
  }
}
