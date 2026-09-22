import { Injectable } from '@nestjs/common';
import { normalizeRouteCode } from '../mappers/route.mapper.js';
import { RouteRepository } from '../repository/route.repository.js';

@Injectable()
export class RemoveRouteUseCase {
  constructor(private readonly routes: RouteRepository) {}

  async execute(uuid: string) {
    const route = await this.routes.findByUuid(uuid);
    await this.routes.remove(route);
    return {
      id: route.uuid,
      route_code: normalizeRouteCode(route.route_code),
    };
  }
}
