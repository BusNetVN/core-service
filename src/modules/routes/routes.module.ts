import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module.js';
import { Company } from '../companies/entities/company.entity.js';
import { RoutesController } from './controllers/routes.controller.js';
import { Route } from './entities/route.entity.js';
import { RouteRepository } from './repository/route.repository.js';
import { CreateRouteUseCase } from './usecases/create-route.usecase.js';
import { FindAllRoutesUseCase } from './usecases/find-all-routes.usecase.js';
import { FindRouteUseCase } from './usecases/find-route.usecase.js';
import { RemoveRouteUseCase } from './usecases/remove-route.usecase.js';
import { ReorderRoutesUseCase } from './usecases/reorder-routes.usecase.js';
import { UpdateRouteUseCase } from './usecases/update-route.usecase.js';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Company]), CompaniesModule],
  controllers: [RoutesController],
  providers: [
    RouteRepository,
    FindAllRoutesUseCase,
    FindRouteUseCase,
    CreateRouteUseCase,
    UpdateRouteUseCase,
    RemoveRouteUseCase,
    ReorderRoutesUseCase,
  ],
  exports: [RouteRepository],
})
export class RoutesModule {}
