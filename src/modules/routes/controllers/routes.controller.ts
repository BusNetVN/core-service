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
import { CreateRouteDto } from '../dto/create-route.dto.js';
import { ReorderRoutesDto } from '../dto/reorder-routes.dto.js';
import { UpdateRouteDto } from '../dto/update-route.dto.js';
import { CreateRouteUseCase } from '../usecases/create-route.usecase.js';
import { FindAllRoutesUseCase } from '../usecases/find-all-routes.usecase.js';
import { FindRouteUseCase } from '../usecases/find-route.usecase.js';
import { RemoveRouteUseCase } from '../usecases/remove-route.usecase.js';
import { ReorderRoutesUseCase } from '../usecases/reorder-routes.usecase.js';
import { UpdateRouteUseCase } from '../usecases/update-route.usecase.js';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly findAllRoutes: FindAllRoutesUseCase,
    private readonly findRoute: FindRouteUseCase,
    private readonly createRoute: CreateRouteUseCase,
    private readonly updateRoute: UpdateRouteUseCase,
    private readonly reorderRoutes: ReorderRoutesUseCase,
    private readonly removeRoute: RemoveRouteUseCase,
  ) {}

  @Get()
  @RequirePermission(ApiPermission.ROUTE_LIST)
  findAll(
    @CurrentUser() user: AccessTokenPayload,
    @Query('company_uuid') companyUuid?: string,
    @Query('q') query?: string,
  ) {
    return this.findAllRoutes.execute(
      companyUuidFromToken(user, companyUuid),
      query,
    );
  }

  @Patch('reorder')
  @RequirePermission(ApiPermission.ROUTE_UPDATE)
  reorder(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: ReorderRoutesDto,
  ) {
    dto.company_uuid = requiredCompanyUuidFromToken(user, dto.company_uuid);
    return this.reorderRoutes.execute(dto);
  }

  @Get(':id')
  @RequirePermission(ApiPermission.ROUTE_LIST)
  async findOne(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const route = await this.findRoute.execute(id);
    assertCompanyResource(user, route.company_uuid);
    return route;
  }

  @Post()
  @RequirePermission(ApiPermission.ROUTE_CREATE)
  create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateRouteDto,
  ) {
    dto.company_uuid = requiredCompanyUuidFromToken(user, dto.company_uuid);
    return this.createRoute.execute(dto);
  }

  @Patch(':id')
  @RequirePermission(ApiPermission.ROUTE_UPDATE)
  async update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateRouteDto,
  ) {
    const route = await this.findRoute.execute(id);
    assertCompanyResource(user, route.company_uuid);
    return this.updateRoute.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermission(ApiPermission.ROUTE_DELETE)
  async remove(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const route = await this.findRoute.execute(id);
    assertCompanyResource(user, route.company_uuid);
    return this.removeRoute.execute(id);
  }
}
