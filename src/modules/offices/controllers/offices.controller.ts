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
import { CreateOfficeDto } from '../dto/create-office.dto.js';
import { UpdateOfficeDto } from '../dto/update-office.dto.js';
import { CreateOfficeUseCase } from '../usecases/create-office.usecase.js';
import { FindAllOfficesUseCase } from '../usecases/find-all-offices.usecase.js';
import { FindOfficeUseCase } from '../usecases/find-office.usecase.js';
import { RemoveOfficeUseCase } from '../usecases/remove-office.usecase.js';
import { UpdateOfficeUseCase } from '../usecases/update-office.usecase.js';

@Controller('offices')
export class OfficesController {
  constructor(
    private readonly findAllOffices: FindAllOfficesUseCase,
    private readonly findOffice: FindOfficeUseCase,
    private readonly createOffice: CreateOfficeUseCase,
    private readonly updateOffice: UpdateOfficeUseCase,
    private readonly removeOffice: RemoveOfficeUseCase,
  ) {}

  @Get()
  @RequirePermission(ApiPermission.OFFICE_LIST)
  findAll(
    @CurrentUser() user: AccessTokenPayload,
    @Query('company_uuid') companyUuid?: string,
    @Query('q') query?: string,
  ) {
    return this.findAllOffices.execute(
      companyUuidFromToken(user, companyUuid),
      query,
    );
  }

  @Get(':id')
  @RequirePermission(ApiPermission.OFFICE_LIST)
  async findOne(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const office = await this.findOffice.execute(id);
    assertCompanyResource(user, office.company_uuid);
    return office;
  }

  @Post()
  @RequirePermission(ApiPermission.OFFICE_CREATE)
  create(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateOfficeDto,
  ) {
    dto.company_uuid = requiredCompanyUuidFromToken(user, dto.company_uuid);
    return this.createOffice.execute(dto);
  }

  @Patch(':id')
  @RequirePermission(ApiPermission.OFFICE_UPDATE)
  async update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateOfficeDto,
  ) {
    const office = await this.findOffice.execute(id);
    assertCompanyResource(user, office.company_uuid);
    return this.updateOffice.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermission(ApiPermission.OFFICE_DELETE)
  async remove(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', UuidParamPipe) id: string,
  ) {
    const office = await this.findOffice.execute(id);
    assertCompanyResource(user, office.company_uuid);
    return this.removeOffice.execute(id);
  }
}
