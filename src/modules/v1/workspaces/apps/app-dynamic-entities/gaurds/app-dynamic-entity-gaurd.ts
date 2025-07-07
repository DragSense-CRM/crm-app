import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { DepDynamicEntitiesService } from '../app-dynamic-entities.service';

@Injectable()
export class DepDynamicEntitiesGuard implements CanActivate {
  constructor(private readonly depDynamicEntitiesService: DepDynamicEntitiesService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const app = req.app;

    const dynamicEntityId =
      Number(req.params.entityId) ||
      Number(req.body.entityId) ||
      Number(req.query.entityId);

    if (!dynamicEntityId) {
      throw new ForbiddenException('Entity ID is required.');
    }

    const depDynamicEntity = await this.depDynamicEntitiesService.findOne(app, dynamicEntityId);

    req.depDynamicEntity = depDynamicEntity;

    return true;
  }
}
