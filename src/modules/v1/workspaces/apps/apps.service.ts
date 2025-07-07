import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { App } from './entities/app.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { AppListDto } from './dto/app-list.dto';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
  ) { }

  async create(
    workspace: Pick<Workspace, 'id'>,
    createAppDto: CreateAppDto,
  ): Promise<MessageResponse & { app: App }> {
    const existing = await this.appRepository.findOne({
      where: { name: createAppDto.name, workspace: { id: workspace.id } },
    });

    if (existing) {
      throw new BadRequestException('An app with this name already exists.');
    }

    const app = this.appRepository.create({
      ...createAppDto,
      workspace,
    });

    const savedApp = await this.appRepository.save(app);

    return { message: 'App created successfully.', app: savedApp };
  }

  async findAll(
    workspace: Pick<Workspace, 'id'>,
    queryDto: AppListDto,
  ): Promise<PaginationResponse<App>> {
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

    const query = this.appRepository.createQueryBuilder('app')
      .leftJoin('app.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId: workspace.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('app.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(app.name ILIKE :search OR app.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue !== undefined && coercedValue !== null) {
          query.andWhere(`app.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('app.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('app.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('app.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('app.updatedAt <= :updatedBefore', { updatedBefore });
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

  async findOne(
    workspace: Pick<Workspace, 'id'>,
    id: number,
  ): Promise<App> {
    const app = await this.appRepository.findOne({
      where: { id },
      relations: ['workspace'],
    });

    if (!app) {
      throw new NotFoundException(`App with ID ${id} not found.`);
    }

    if (app.workspace.id !== workspace.id) {
      throw new BadRequestException('You are not authorized to access this app.');
    }

    return app;
  }

  async update(
    workspace: Pick<Workspace, 'id'>,
    id: number,
    updateAppDto: UpdateAppDto,
  ): Promise<MessageResponse> {
    const app = await this.findOne(workspace, id);

    if (updateAppDto.name && updateAppDto.name !== app.name) {
      const existing = await this.appRepository.findOne({
        where: {
          name: updateAppDto.name,
          id: Not(app.id),
          workspace: { id: workspace.id },
        },
      });

      if (existing) {
        throw new BadRequestException('An app with this name already exists.');
      }
    }

    const updated = this.appRepository.merge(app, updateAppDto);
    await this.appRepository.save(updated);

    return { message: 'App updated successfully.' };
  }

  async remove(
    workspace: Pick<Workspace, 'id'>,
    id: number,
  ): Promise<void> {
    const app = await this.findOne(workspace, id);
    await this.appRepository.remove(app);
  }
}
