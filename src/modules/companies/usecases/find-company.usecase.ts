import { Injectable } from '@nestjs/common';
import { toPublicCompany } from '../mappers/company.mapper.js';
import { CompanyRepository } from '../repository/company.repository.js';

@Injectable()
export class FindCompanyUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(uuid: string) {
    return toPublicCompany(await this.companies.findByUuid(uuid));
  }
}
