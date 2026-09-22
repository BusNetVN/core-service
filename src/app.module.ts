import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config.js';
import jwtConfig from './config/jwt.config.js';
import { CommonModule } from './common/common.module.js';
import { DatabaseModule } from './database/database.module.js';
import { CompaniesModule } from './modules/companies/companies.module.js';
import { OfficesModule } from './modules/offices/offices.module.js';
import { RoutesModule } from './modules/routes/routes.module.js';
import { SeatMapsModule } from './modules/seat-maps/seat-maps.module.js';
import { SchedulesModule } from './modules/schedules/schedules.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, jwtConfig],
    }),
    DatabaseModule,
    CommonModule,
    CompaniesModule,
    OfficesModule,
    RoutesModule,
    SeatMapsModule,
    SchedulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
