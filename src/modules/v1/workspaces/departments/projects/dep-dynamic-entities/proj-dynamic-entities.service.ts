import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { ProjDynamicEntity } from './entities/proj-dynamic-entity.entity';

import { MessageResponse } from '@/interfaces/general.interface';


import { DynamicEntitiesService } from '../../dynamic-entities/dynamic-entities.service';

import { Workspace } from '../../entities/workspace.entity';
import { Projartment } from '../entities/projartment.entity';
import { DynamicEntity } from '../../dynamic-entities/entities/dynamic-entity.entity';

import { DynamicEntityListDto } from '../../dynamic-entities/dto/dynamic-entity-list.dto';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { UpdateProjDynamicEntityDto } from './dto/update-proj-dynamic-entity.dto';
import { CreateProjDynamicEntityDto } from './dto/create-proj-dynamic-entity.dto';



@Injectable()
export class ProjDynamicEntitiesService {

  TABLE_PREFIX = 'ws_dynamic_entity_';

  constructor(
    @InjectRepository(ProjDynamicEntity)
    private readonly projDynamicEntityRepositorydynamic: Repository<ProjDynamicEntity>,
    private readonly dynamicEntitiesService: DynamicEntitiesService,
  ) { }

  async create(workspace: Pick<Workspace, 'id'>, projartment: Pick<Projartment, 'id'>, createProjDynamicEntityDto: CreateProjDynamicEntityDto): Promise<MessageResponse & { projEntity: ProjDynamicEntity }> {
    if (!createProjDynamicEntityDto.dynamicEntityId && !createProjDynamicEntityDto.newEntity) {
      throw new BadRequestException('Either dynamicEntityId or newEntity must be provided');
    }

    const { dynamicEntityId, newEntity } = createProjDynamicEntityDto;

    let dynamicEntity: DynamicEntity | null = null;
    if (dynamicEntityId) {
      dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, dynamicEntityId);
    } else if (newEntity) {
      const savedDynamicEntity = await this.dynamicEntitiesService.create(workspace, newEntity);
      dynamicEntity = savedDynamicEntity.dynamicEntity;
    }

    if (!dynamicEntity) throw new NotFoundException('Dynamic entity not found');

    const savedProjDynamicEntity = await this.projDynamicEntityRepositorydynamic.save({
      dynamicEntity,
      projartment,
    });

    return { message: 'Projartment dynamic entity created successfully.', projEntity: savedProjDynamicEntity };

  }

  async update(workspace: Pick<Workspace, 'id'>, id: number, updateProjDynamicEntityDto: UpdateProjDynamicEntityDto): Promise<MessageResponse> {

    const existingEntity = await this.findOne(workspace, id);

    const { dynamicEntityId } = updateProjDynamicEntityDto;

    let dynamicEntity = existingEntity.dynamicEntity;

    if (dynamicEntityId && dynamicEntityId !== existingEntity.dynamicEntity?.id) {
      dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, dynamicEntityId);
    }

    await this.projDynamicEntityRepositorydynamic.update(id, { dynamicEntity });

    return { message: 'Dynamic entity updated successfully.' };

  }

  async findOne(projartment: Pick<Projartment, "id">, id: number): Promise<ProjDynamicEntity> {

    const projDynamicEntity = await this.projDynamicEntityRepositorydynamic.findOne({
      where: { id },
      relations: ['dynamicEntity', 'projartment'],
    });

    if (!projDynamicEntity) {
      throw new NotFoundException(`Projartment dynamic entity with ID ${id} not found.`);
    }

    if (projDynamicEntity.projartment.id !== projartment.id) {
      throw new BadRequestException('You are not authorized to access this projartment entity.');
    }

    return projDynamicEntity;
  }

  async findOneByName(projartment: Pick<Projartment, "id">, name: string): Promise<ProjDynamicEntity> {

    const projDynamicEntity = await this.projDynamicEntityRepositorydynamic.findOne({
      where: { dynamicEntity: { name } },
      relations: ['dynamicEntity', 'projartment'],
    });

    if (!projDynamicEntity) {
      throw new NotFoundException(`Projartment dynamic entity with NAME ${name} not found.`);
    }

    if (projDynamicEntity.projartment.id !== projartment.id) {
      throw new BadRequestException('You are not authorized to access this projartment enity.');
    }

    return projDynamicEntity;
  }

  async findAll(projartment: Pick<Projartment, "id">, queryDto: DynamicEntityListDto): Promise<PaginationResponse<ProjDynamicEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      ...filters
    } = queryDto;

    const query = this.projDynamicEntityRepositorydynamic.createQueryBuilder('projDynamicEntity')
      .leftJoin('projDynamicEntity.projartment', 'projartment')
      .where('projartment.id = :projartmentId', { projartmentId: projartment.id })
      .leftJoin('projDynamicEntity.dynamicEntity', 'dynamicEntity')
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('projDynamicEntity.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(dynamicEntity.name ILIKE :search OR dynamicEntity.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`dynamicEntity.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('projDynamicEntity.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('projDynamicEntity.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('projDynamicEntity.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('projDynamicEntity.updatedAt <= :updatedBefore', { updatedBefore });
    }

    const [data, total] = await query.getManyAndCount();
    const lastPage = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      lastPage,
      hasNextPage: page < lastPage,
      hasPrevPage: page > 1,
    };
  }

  async remove(workspace: Pick<Workspace, 'id'>, projartment: Pick<Projartment, 'id'>, id: number): Promise<MessageResponse> {

    const projDynamicEntity = await this.findOne(projartment, id);

    await this.dynamicEntitiesService.remove(workspace, projDynamicEntity.dynamicEntity.id);

    await this.projDynamicEntityRepositorydynamic.remove(projDynamicEntity);

    return { message: `Projartment dynamic entity and table '${projDynamicEntity.dynamicEntity.name}' deleted successfully.` };
  }

}