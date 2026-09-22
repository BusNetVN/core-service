import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module.js';
import { Company } from '../companies/entities/company.entity.js';
import { SeatMapsController } from './controllers/seat-maps.controller.js';
import { SeatMap } from './entities/seat-map.entity.js';
import { SeatMapRepository } from './repository/seat-map.repository.js';
import { CreateSeatMapUseCase } from './usecases/create-seat-map.usecase.js';
import { FindAllSeatMapsUseCase } from './usecases/find-all-seat-maps.usecase.js';
import { FindSeatMapUseCase } from './usecases/find-seat-map.usecase.js';
import { RemoveSeatMapUseCase } from './usecases/remove-seat-map.usecase.js';
import { UpdateSeatMapUseCase } from './usecases/update-seat-map.usecase.js';

@Module({
  imports: [TypeOrmModule.forFeature([SeatMap, Company]), CompaniesModule],
  controllers: [SeatMapsController],
  providers: [
    SeatMapRepository,
    FindAllSeatMapsUseCase,
    FindSeatMapUseCase,
    CreateSeatMapUseCase,
    UpdateSeatMapUseCase,
    RemoveSeatMapUseCase,
  ],
  exports: [SeatMapRepository],
})
export class SeatMapsModule {}
