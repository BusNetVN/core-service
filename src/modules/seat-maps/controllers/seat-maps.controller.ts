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
import { CreateSeatMapDto } from '../dto/create-seat-map.dto.js';
import { UpdateSeatMapDto } from '../dto/update-seat-map.dto.js';
import { CreateSeatMapUseCase } from '../usecases/create-seat-map.usecase.js';
import { FindAllSeatMapsUseCase } from '../usecases/find-all-seat-maps.usecase.js';
import { FindSeatMapUseCase } from '../usecases/find-seat-map.usecase.js';
import { RemoveSeatMapUseCase } from '../usecases/remove-seat-map.usecase.js';
import { UpdateSeatMapUseCase } from '../usecases/update-seat-map.usecase.js';

@Controller('seat-maps')
export class SeatMapsController {
  constructor(
    private readonly findAllSeatMaps: FindAllSeatMapsUseCase,
    private readonly findSeatMap: FindSeatMapUseCase,
    private readonly createSeatMap: CreateSeatMapUseCase,
    private readonly updateSeatMap: UpdateSeatMapUseCase,
    private readonly removeSeatMap: RemoveSeatMapUseCase,
  ) {}

  @Get()
  @RequirePermission(ApiPermission.SEAT_MAP_LIST)
  findAll(
    @CurrentUser() user: AccessTokenPayload,
    @Query('company_uuid') companyUuid?: string,
    @Query('q') query?: string,
  ) {
    return this.findAllSeatMaps.execute(
      companyUuidFromToken(user, companyUuid),
      query,
    );
  }

  @Get(':id')
  @RequirePermission(ApiPermission.SEAT_MAP_LIST)
  async findOne(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const seatMap = await this.findSeatMap.execute(id);
    assertCompanyResource(user, seatMap.company_uuid);
    return seatMap;
  }

  @Post()
  @RequirePermission(ApiPermission.SEAT_MAP_CREATE)
  create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateSeatMapDto,
  ) {
    dto.company_uuid = requiredCompanyUuidFromToken(user, dto.company_uuid);
    return this.createSeatMap.execute(dto);
  }

  @Patch(':id')
  @RequirePermission(ApiPermission.SEAT_MAP_UPDATE)
  async update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateSeatMapDto,
  ) {
    const seatMap = await this.findSeatMap.execute(id);
    assertCompanyResource(user, seatMap.company_uuid);
    return this.updateSeatMap.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermission(ApiPermission.SEAT_MAP_DELETE)
  async remove(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const seatMap = await this.findSeatMap.execute(id);
    assertCompanyResource(user, seatMap.company_uuid);
    return this.removeSeatMap.execute(id);
  }
}
