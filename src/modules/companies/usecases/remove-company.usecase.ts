import { Injectable } from '@nestjs/common';
import { normalizeCompanyCode } from '../mappers/company.mapper.js';
import { CompanyRepository } from '../repository/company.repository.js';

@Injectable()
export class RemoveCompanyUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(uuid: string) {
    const company = await this.companies.findByUuid(uuid);
    await this.companies.remove(company);
    return {
      id: company.uuid,
      company_code: normalizeCompanyCode(company.company_code),
    };
  }
}
