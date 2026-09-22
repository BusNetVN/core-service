import { Injectable } from '@nestjs/common';
import { toPublicRoute } from '../mappers/route.mapper.js';
import { RouteRepository } from '../repository/route.repository.js';

@Injectable()
export class FindRouteUseCase {
  constructor(private readonly routes: RouteRepository) {}

  async execute(uuid: string) {
    return toPublicRoute(await this.routes.findByUuid(uuid));
  }
}
