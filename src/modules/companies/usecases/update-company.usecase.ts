import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from '../dto/update-company.dto.js';
import { Company } from '../entities/company.entity.js';
import {
  normalizeCompanyCode,
  toPublicCompany,
} from '../mappers/company.mapper.js';
import { CompanyRepository } from '../repository/company.repository.js';

@Injectable()
export class UpdateCompanyUseCase {
  constructor(private readonly companies: CompanyRepository) {}

  async execute(uuid: string, dto: UpdateCompanyDto) {
    const company = await this.companies.findByUuid(uuid);
    await this.companies.assertUnique(
      dto.company_code ? normalizeCompanyCode(dto.company_code) : undefined,
      dto.slug,
      company.id,
    );
    this.companies.merge(company, this.definedFields(dto));
    return toPublicCompany(await this.companies.save(company));
  }

  private definedFields(dto: UpdateCompanyDto): Partial<Company> {
    const fields: Partial<Company> = {};
    (Object.keys(dto) as Array<keyof UpdateCompanyDto>).forEach((key) => {
      const value = dto[key];
      if (value !== undefined) {
        (fields as Record<string, unknown>)[key] =
          key === 'company_code' && typeof value === 'string'
            ? normalizeCompanyCode(value)
            : value;
      }
    });
    return fields;
  }
}
