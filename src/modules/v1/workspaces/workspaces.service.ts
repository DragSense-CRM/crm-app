import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { Workspace } from './entities/workspace.entity';
import { User } from '../users/entities/user.entity';


import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceListDto } from './dto/workspace-list.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) { }

  async create(user: Pick<User, "id">, createWorkspaceDto: CreateWorkspaceDto): Promise<MessageResponse> {
    const existing = await this.workspaceRepository.findOne({
      where: { name: createWorkspaceDto.name },
    });

    if (existing) {
      throw new BadRequestException('A workspace with this name already exists.');
    }

    const workspace = this.workspaceRepository.create({
      ...createWorkspaceDto,
      createdBy: user,
    });
    await this.workspaceRepository.save(workspace);

    return { message: 'Workspace created successfully.' };
  }

  async findAll(user: Pick<User, "id">, queryDto: WorkspaceListDto): Promise<PaginationResponse<Workspace>> {
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

    const query = this.workspaceRepository.createQueryBuilder('workspace');

    query
      .leftJoin('workspace.createdBy', 'createdBy')
      .where('createdBy.id = :userId', { userId: user.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('workspace.createdAt', 'DESC');

    if (search) {
      query.andWhere(`workspace.name ILIKE :search`, { search: `%${search}%` });
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`workspace.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('workspace.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('workspace.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('workspace.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('workspace.updatedAt <= :updatedBefore', { updatedBefore });
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

  async findOne(user: Pick<User, "id">, id: number): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found.`);
    }

    if (workspace.createdBy.id !== user.id) {
      throw new BadRequestException('You are not authorized to access this workspace.');
    }

    return workspace;
  }

  async update(user: Pick<User, "id">, id: number, updateWorkspaceDto: UpdateWorkspaceDto): Promise<MessageResponse> {
    const workspace = await this.findOne(user, id);


    if (updateWorkspaceDto.name && updateWorkspaceDto.name !== workspace.name) {
      const existing = await this.workspaceRepository.findOne({
        where: { name: updateWorkspaceDto.name, id: Not(workspace.id) },
      });

      if (existing) {
        throw new BadRequestException('A workspace with this name already exists.');
      }
    }


    const updated = this.workspaceRepository.merge(workspace, updateWorkspaceDto);
    await this.workspaceRepository.save(updated);

    return { message: 'Workspace updated successfully.' };
  }

  async remove(user: Pick<User, "id">, id: number): Promise<void> {
    const workspace = await this.findOne(user, id);

    if (!workspace) {
      throw new NotFoundException('Workspace not found.');
    }

    // Example: check if workspace has dependent entities (optional logic)
    // if (workspace.projects?.length) throw new BadRequestException("Cannot delete workspace with attached projects");

    await this.workspaceRepository.remove(workspace);
  }
}
