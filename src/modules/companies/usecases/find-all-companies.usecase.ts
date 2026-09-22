import { Injectable } from '@nestjs/common';
import { toPublicCompany } from '../mappers/company.mapper.js';
import { CompanyRepository } from '../repository/company.repository.js';

@Injectable()
export class FindAllCompaniesUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(query?: string) {
    const companies = await this.companies.findAll(query);
    return companies.map(toPublicCompany);
  }
}
