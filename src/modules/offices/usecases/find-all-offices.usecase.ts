import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../companies/repository/company.repository.js';
import { toPublicOffice } from '../mappers/office.mapper.js';
import { OfficeRepository } from '../repository/office.repository.js';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class FindAllOfficesUseCase {
  constructor(
    private readonly offices: OfficeRepository,
    private readonly companies: CompanyRepository,
  ) {}

  async execute(companyUuid?: string, query?: string) {
    if (!companyUuid || !UUID_V4.test(companyUuid)) {
      throw new BadRequestException('Vui lòng chọn nhà xe.');
    }

    const company = await this.companies.findByUuid(companyUuid);
    const offices = await this.offices.findAll(company.id, query);
    return offices.map(toPublicOffice);
  }
}
