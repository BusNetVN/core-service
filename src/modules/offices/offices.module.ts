import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module.js';
import { Company } from '../companies/entities/company.entity.js';
import { OfficesController } from './controllers/offices.controller.js';
import { Office } from './entities/office.entity.js';
import { OfficeRepository } from './repository/office.repository.js';
import { CreateOfficeUseCase } from './usecases/create-office.usecase.js';
import { FindAllOfficesUseCase } from './usecases/find-all-offices.usecase.js';
import { FindOfficeUseCase } from './usecases/find-office.usecase.js';
import { RemoveOfficeUseCase } from './usecases/remove-office.usecase.js';
import { UpdateOfficeUseCase } from './usecases/update-office.usecase.js';

@Module({
  imports: [TypeOrmModule.forFeature([Office, Company]), CompaniesModule],
  controllers: [OfficesController],
  providers: [
    OfficeRepository,
    FindAllOfficesUseCase,
    FindOfficeUseCase,
    CreateOfficeUseCase,
    UpdateOfficeUseCase,
    RemoveOfficeUseCase,
  ],
  exports: [OfficeRepository],
})
export class OfficesModule {}
