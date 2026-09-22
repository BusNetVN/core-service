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
import { ApiPermission } from '../../../common/constants/api-permissions.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { RequirePermission } from '../../../common/decorators/require-permission.decorator.js';
import { UuidParamPipe } from '../../../common/pipes/uuid-param.pipe.js';
import type { AccessTokenPayload } from '../../../common/types/access-token-payload.js';
import {
  assertCompanyResource,
  companyUuidFromToken,
  requiredCompanyUuidFromToken,
} from '../../../common/utils/company-scope.js';
import { CreateScheduleDto } from '../dto/create-schedule.dto.js';
import { UpdateScheduleDto } from '../dto/update-schedule.dto.js';
import { CreateScheduleUseCase } from '../usecases/create-schedule.usecase.js';
import { FindAllSchedulesUseCase } from '../usecases/find-all-schedules.usecase.js';
import { FindScheduleUseCase } from '../usecases/find-schedule.usecase.js';
import { RemoveScheduleUseCase } from '../usecases/remove-schedule.usecase.js';
import { UpdateScheduleUseCase } from '../usecases/update-schedule.usecase.js';

@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly findAllSchedules: FindAllSchedulesUseCase,
    private readonly findSchedule: FindScheduleUseCase,
    private readonly createSchedule: CreateScheduleUseCase,
    private readonly updateSchedule: UpdateScheduleUseCase,
    private readonly removeSchedule: RemoveScheduleUseCase,
  ) {}

  @Get()
  @RequirePermission(ApiPermission.SCHEDULE_LIST)
  findAll(
    @CurrentUser() user: AccessTokenPayload,
    @Query('company_uuid') companyUuid?: string,
    @Query('q') query?: string,
  ) {
    return this.findAllSchedules.execute(
      companyUuidFromToken(user, companyUuid),
      query,
    );
  }

  @Get(':id')
  @RequirePermission(ApiPermission.SCHEDULE_LIST)
  async findOne(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const schedule = await this.findSchedule.execute(id);
    assertCompanyResource(user, schedule.company_uuid);
    return schedule;
  }

  @Post()
  @RequirePermission(ApiPermission.SCHEDULE_CREATE)
  create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateScheduleDto,
  ) {
    dto.company_uuid = requiredCompanyUuidFromToken(user, dto.company_uuid);
    return this.createSchedule.execute(dto);
  }

  @Patch(':id')
  @RequirePermission(ApiPermission.SCHEDULE_UPDATE)
  async update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    const schedule = await this.findSchedule.execute(id);
    assertCompanyResource(user, schedule.company_uuid);
    return this.updateSchedule.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermission(ApiPermission.SCHEDULE_DELETE)
  async remove(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const schedule = await this.findSchedule.execute(id);
    assertCompanyResource(user, schedule.company_uuid);
    return this.removeSchedule.execute(id);
  }
}
