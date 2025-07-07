import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { Project } from './entities/project.entity';
import { Department } from '../entities/department.entity';
import { Workspace } from '../../entities/workspace.entity';

import { AppsService } from '../../apps/apps.service';


import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectListDto } from './dto/project-list.dto';
import { App } from 'supertest/types';


@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly appService: AppsService,
  ) { }

  async create(
    workspace: Pick<Workspace, 'id'>,
    department: Pick<Department, 'id'>,
    createProjectDto: CreateProjectDto,
  ): Promise<MessageResponse> {

    const existing = await this.projectRepository.findOne({
      where: { name: createProjectDto.name, department: { id: department.id } },
    });

    if (existing) {
      throw new BadRequestException('A project with this name already exists.');
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      department,
    });


    if (createProjectDto.appId) {
      const app = await this.appService.findOne(workspace, createProjectDto.appId);
      project.app = app;
    }
    else if (createProjectDto.newApp) {
      const { app } = await this.appService.create(workspace, createProjectDto.newApp);
      project.app = app;
    }

    await this.projectRepository.save(project);

    return { message: 'Project created successfully.' };
  }

  async findAll(
    department: Pick<Department, 'id'>,
    queryDto: ProjectListDto,
  ): Promise<PaginationResponse<Project>> {
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

    const query = this.projectRepository.createQueryBuilder('project');

    query
      .leftJoin('project.department', 'department')
      .where('department.id = :departmentId', { departmentId: department.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('project.createdAt', 'DESC');

    if (search) {
      query.andWhere(`project.name ILIKE :search`, { search: `%${search}%` });
    }


    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`project.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }


    if (createdAfter) {
      query.andWhere('project.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('project.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('project.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('project.updatedAt <= :updatedBefore', { updatedBefore });
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
    department: Pick<Department, 'id'>,
    id: number,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    if (project.department.id !== department.id) {
      throw new BadRequestException(
        'You are not authorized to access this project.',
      );
    }

    return project;
  }

  async update(
    department: Pick<Department, 'id'>,
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<MessageResponse> {
    const project = await this.findOne(department, id);


    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      const existing = await this.projectRepository.findOne({
        where: { name: updateProjectDto.name, id: Not(project.id), department: { id: department.id } },
      });

      if (existing) {
        throw new BadRequestException('A project with this name already exists.');
      }
    }

    const updated = this.projectRepository.merge(project, updateProjectDto);
    await this.projectRepository.save(updated);

    return { message: 'Project updated successfully.' };
  }

  async remove(
    department: Pick<Department, 'id'>,
    id: number,
  ): Promise<void> {
    const project = await this.findOne(department, id);

    // Optional: Check for dependent entities before deletion
    // if (project.tasks?.length) {
    //   throw new BadRequestException(
    //     'Cannot delete project with associated tasks',
    //   );
    // }

    await this.projectRepository.remove(project);
  }
}