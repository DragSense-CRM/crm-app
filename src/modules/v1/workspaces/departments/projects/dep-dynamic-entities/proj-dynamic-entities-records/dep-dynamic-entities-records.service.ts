import {
  Injectable,
} from '@nestjs/common';


import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { DynamicEntitiesRecordService } from '../../../dynamic-entities/dynamic-entities-records/dynamic-entities-records.service';
import { Workspace } from '../../../entities/workspace.entity';
import { ProjDynamicEntity } from '../entities/proj-dynamic-entity.entity';

import { DynamicEntity } from '../../../dynamic-entities/entities/dynamic-entity.entity';
import { DynamicEntitiesService } from '../../../dynamic-entities/dynamic-entities.service';
import { UpdateDynamicEntitiesRecordDto } from '../../../dynamic-entities/dynamic-entities-records/dto/update-dynamic-entities-record.dto';
import { CreateDynamicEntitiesRecordDto } from '../../../dynamic-entities/dynamic-entities-records/dto/create-dynamic-entities-record.dto';
import { DynamicEntitiesRecordListDto } from '../../../dynamic-entities/dynamic-entities-records/dto/dynamic-entities-record-list.dto';


@Injectable()
export class ProjDynamicEntitiesRecordService {
  constructor(
    private readonly dynamicEntitiesRecordService: DynamicEntitiesRecordService,
    private readonly dynamicEntitiesService: DynamicEntitiesService

  ) { }

  async create(workspace: Pick<Workspace, "id">, projdynamicEntity: Pick<ProjDynamicEntity, "id">, createProjDynamicEntitiesRecordDto: CreateDynamicEntitiesRecordDto): Promise<MessageResponse> {

    const dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, projdynamicEntity.id);

    await this.dynamicEntitiesRecordService.create(workspace, dynamicEntity, createProjDynamicEntitiesRecordDto);

    return { message: 'Projartment dynamic entity record created successfully.' };
  }


  async findAll(workspace: Pick<Workspace, "id">, projdynamicEntity: Pick<ProjDynamicEntity, "id">, queryDto: DynamicEntitiesRecordListDto): Promise<PaginationResponse<any>> {

    const dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, projdynamicEntity.id);

    return this.dynamicEntitiesRecordService.findAll(workspace, dynamicEntity, queryDto);
  }

  async findOne(workspace: Pick<Workspace, "id">, projdynamicEntity: Pick<ProjDynamicEntity, "id">, id: string): Promise<any> {

    const dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, projdynamicEntity.id);

    const dynamicEntityRecord = await this.dynamicEntitiesRecordService.findOne(workspace, dynamicEntity, id);

    return dynamicEntityRecord;
  }

  async update(
    workspace: Pick<Workspace, "id">,
    projdynamicEntity: Pick<ProjDynamicEntity, "id">,
    id: string,
    updateProjDynamicEntitiesRecordDto: UpdateDynamicEntitiesRecordDto
  ): Promise<MessageResponse> {

    const dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, projdynamicEntity.id);

    await this.dynamicEntitiesRecordService.update(workspace, dynamicEntity, id, updateProjDynamicEntitiesRecordDto);

    return { message: 'Projartment dynamic entities record updated successfully.' };

  }

  async remove(workspace: Pick<Workspace, "id">, projdynamicEntity: Pick<ProjDynamicEntity, "id">, id: string): Promise<void> {
    const dynamicEntity = await this.findOne(workspace, projdynamicEntity, id);
    await this.dynamicEntitiesRecordService.remove(workspace, dynamicEntity, id);
  }
}
