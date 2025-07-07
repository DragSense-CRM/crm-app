import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { DepDynamicEntity } from './entities/app-dynamic-entity.entity';

import { MessageResponse } from '@/interfaces/general.interface';


import { DynamicEntitiesService } from '../../dynamic-entities/dynamic-entities.service';

import { Workspace } from '../../entities/workspace.entity';
import { App } from '../entities/app.entity';
import { DynamicEntity } from '../../dynamic-entities/entities/dynamic-entity.entity';

import { DynamicEntityListDto } from '../../dynamic-entities/dto/dynamic-entity-list.dto';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { UpdateDepDynamicEntityDto } from './dto/update-app-dynamic-entity.dto';
import { CreateDepDynamicEntityDto } from './dto/create-app-dynamic-entity.dto';



@Injectable()
export class DepDynamicEntitiesService {


  constructor(
    @InjectRepository(DepDynamicEntity)
    private readonly depDynamicEntityRepositorydynamic: Repository<DepDynamicEntity>,
    private readonly dynamicEntitiesService: DynamicEntitiesService,
  ) { }

  async create(workspace: Pick<Workspace, 'id'>, app: Pick<App, 'id'>, createDepDynamicEntityDto: CreateDepDynamicEntityDto): Promise<MessageResponse & { depEntity: DepDynamicEntity }> {
    if (!createDepDynamicEntityDto.dynamicEntityId && !createDepDynamicEntityDto.newEntity) {
      throw new BadRequestException('Either dynamicEntityId or newEntity must be provided');
    }

    const { dynamicEntityId, newEntity } = createDepDynamicEntityDto;

    let dynamicEntity: DynamicEntity | null = null;
    if (dynamicEntityId) {
      dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, dynamicEntityId);
    } else if (newEntity) {
      const savedDynamicEntity = await this.dynamicEntitiesService.create(workspace, newEntity);
      dynamicEntity = savedDynamicEntity.dynamicEntity;
    }

    if (!dynamicEntity) throw new NotFoundException('Dynamic entity not found');

    const savedDepDynamicEntity = await this.depDynamicEntityRepositorydynamic.save({
      dynamicEntity,
      app,
    });

    return { message: 'App dynamic entity created successfully.', depEntity: savedDepDynamicEntity };

  }

  async update(workspace: Pick<Workspace, 'id'>, id: number, updateDepDynamicEntityDto: UpdateDepDynamicEntityDto): Promise<MessageResponse> {

    const existingEntity = await this.findOne(workspace, id);

    const { dynamicEntityId } = updateDepDynamicEntityDto;

    let dynamicEntity = existingEntity.dynamicEntity;

    if (dynamicEntityId && dynamicEntityId !== existingEntity.dynamicEntity?.id) {
      dynamicEntity = await this.dynamicEntitiesService.findOne(workspace, dynamicEntityId);
    }

    await this.depDynamicEntityRepositorydynamic.update(id, { dynamicEntity });

    return { message: 'Dynamic entity updated successfully.' };

  }

  async findOne(app: Pick<App, "id">, id: number): Promise<DepDynamicEntity> {

    const depDynamicEntity = await this.depDynamicEntityRepositorydynamic.findOne({
      where: { id },
      relations: ['dynamicEntity', 'app'],
    });

    if (!depDynamicEntity) {
      throw new NotFoundException(`App dynamic entity with ID ${id} not found.`);
    }

    if (depDynamicEntity.app.id !== app.id) {
      throw new BadRequestException('You are not authorized to access this app entity.');
    }

    return depDynamicEntity;
  }

  async findOneByName(app: Pick<App, "id">, name: string): Promise<DepDynamicEntity> {

    const depDynamicEntity = await this.depDynamicEntityRepositorydynamic.findOne({
      where: { dynamicEntity: { name } },
      relations: ['dynamicEntity', 'app'],
    });

    if (!depDynamicEntity) {
      throw new NotFoundException(`App dynamic entity with NAME ${name} not found.`);
    }

    if (depDynamicEntity.app.id !== app.id) {
      throw new BadRequestException('You are not authorized to access this app enity.');
    }

    return depDynamicEntity;
  }

  async findAll(app: Pick<App, "id">, queryDto: DynamicEntityListDto): Promise<PaginationResponse<DepDynamicEntity>> {
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

    const query = this.depDynamicEntityRepositorydynamic.createQueryBuilder('depDynamicEntity')
      .leftJoin('depDynamicEntity.app', 'app')
      .where('app.id = :appId', { appId: app.id })
      .leftJoin('depDynamicEntity.dynamicEntity', 'dynamicEntity')
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('depDynamicEntity.createdAt', 'DESC');

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
      query.andWhere('depDynamicEntity.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('depDynamicEntity.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('depDynamicEntity.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('depDynamicEntity.updatedAt <= :updatedBefore', { updatedBefore });
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

  async remove(workspace: Pick<Workspace, 'id'>, app: Pick<App, 'id'>, id: number): Promise<MessageResponse> {

    const depDynamicEntity = await this.findOne(app, id);

    await this.dynamicEntitiesService.remove(workspace, depDynamicEntity.dynamicEntity.id);

    await this.depDynamicEntityRepositorydynamic.remove(depDynamicEntity);

    return { message: `App dynamic entity and table '${depDynamicEntity.dynamicEntity.name}' deleted successfully.` };
  }

}