import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ProjDynamicEntitiesService } from '../proj-dynamic-entities.service';

@Injectable()
export class ProjDynamicEntitiesGuard implements CanActivate {
  constructor(private readonly projDynamicEntitiesService: ProjDynamicEntitiesService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const projartment = req.projartment;

    const dynamicEntityId =
      Number(req.params.entityId) ||
      Number(req.body.entityId) ||
      Number(req.query.entityId);

    if (!dynamicEntityId) {
      throw new ForbiddenException('Entity ID is required.');
    }

    const projDynamicEntity = await this.projDynamicEntitiesService.findOne(projartment, dynamicEntityId);

    req.projDynamicEntity = projDynamicEntity;

    return true;
  }
}
