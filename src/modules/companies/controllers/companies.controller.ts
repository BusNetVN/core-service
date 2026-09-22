import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RequirePermission } from '../../../common/decorators/require-permission.decorator.js';
import { UuidParamPipe } from '../../../common/pipes/uuid-param.pipe.js';
import { ApiPermission } from '../../../common/constants/api-permissions.js';
import { CreateCompanyDto } from '../dto/create-company.dto.js';
import { UpdateCompanyDto } from '../dto/update-company.dto.js';
import { CreateCompanyUseCase } from '../usecases/create-company.usecase.js';
import { FindAllCompaniesUseCase } from '../usecases/find-all-companies.usecase.js';
import { FindCompanyUseCase } from '../usecases/find-company.usecase.js';
import { RemoveCompanyUseCase } from '../usecases/remove-company.usecase.js';
import { UpdateCompanyUseCase } from '../usecases/update-company.usecase.js';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly findAllCompanies: FindAllCompaniesUseCase,
    private readonly findCompany: FindCompanyUseCase,
    private readonly createCompany: CreateCompanyUseCase,
    private readonly updateCompany: UpdateCompanyUseCase,
    private readonly removeCompany: RemoveCompanyUseCase,
  ) {}

  @Get()
  @RequirePermission(ApiPermission.COMPANY_LIST)
  findAll(@Query('q') query?: string) {
    return this.findAllCompanies.execute(query);
  }

  @Get(':id')
  @RequirePermission(ApiPermission.COMPANY_LIST)
  findOne(@Param('id', UuidParamPipe) id: string) {
    return this.findCompany.execute(id);
  }

  @Post()
  @RequirePermission(ApiPermission.COMPANY_CREATE)
  create(@Body() dto: CreateCompanyDto) {
    return this.createCompany.execute(dto);
  }

  @Patch(':id')
  @RequirePermission(ApiPermission.COMPANY_UPDATE)
  update(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.updateCompany.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermission(ApiPermission.COMPANY_DELETE)
  remove(@Param('id', UuidParamPipe) id: string) {
    return this.removeCompany.execute(id);
  }
}
