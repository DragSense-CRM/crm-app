import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { DynamicEntitiesService } from '../dynamic-entities.service';
import { DynamicEntity } from '../entities/dynamic-entity.entity';

@Injectable()
export class DynamicEntitiesGuard implements CanActivate {
  constructor(private readonly dynamicEntitiesService: DynamicEntitiesService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const workspace = req.workspace;

    const dynamicEntityId =
      Number(req.params.entityId) ||
      Number(req.body.entityId) ||
      Number(req.query.entityId);

    if (!dynamicEntityId) {
      throw new ForbiddenException('Entity ID or Name is required.');
    }

    let dynamicEntity: DynamicEntity | null = null;

    if (dynamicEntityId)
      dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, dynamicEntityId);


    if (!dynamicEntity) {
      throw new ForbiddenException('Entity not found.');
    }

    req.dynamicEntity = dynamicEntity;
    req.body.blueprintId = dynamicEntity.blueprintId;

    return true;
  }
}
