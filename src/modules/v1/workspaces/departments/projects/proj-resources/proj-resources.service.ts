import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ProjResource } from './entities/proj-resource.entity';
import { DepResourcesService } from '../../dep-resources/dep-resources.service';
import { Department } from '../../entities/department.entity';
import { Project } from '../entities/project.entity';

import { MessageResponse } from '@/interfaces/general.interface';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { CreateProjResourceDto } from './dto/create-proj-resource.dto';
import { UpdateProjResourceDto } from './dto/update-proj-resource.dto';
import { ProjResourceListDto } from './dto/proj-resource-list.dto';



@Injectable()
export class ProjResourcesService {
  constructor(
    @InjectRepository(ProjResource)
    private readonly projResourceRepository: Repository<ProjResource>,
    private readonly depResourceServices: DepResourcesService
  ) { }

  async create(
    department: Pick<Department, 'id'>,
    project: Pick<Project, 'id'>,
    createProjResourceDto: CreateProjResourceDto,
  ): Promise<MessageResponse> {


    const existing = await this.projResourceRepository.findOne({
      where: { name: createProjResourceDto.name, project: { id: project.id } },
    });

    if (existing) {
      throw new BadRequestException('A project resource with this name already exists.');
    }

    const {
      depReourceId,
      role,
    } = createProjResourceDto;

    const depResource = await this.depResourceServices.findOne(department, depReourceId);


    const projResource = this.projResourceRepository.create({
      role,
      project,
      depResource,
    });

    await this.projResourceRepository.save(projResource);

    return { message: 'Project resource created successfully.' };
  }

  async findAll(
    project: Pick<Project, 'id'>,
    queryDto: ProjResourceListDto,
  ): Promise<PaginationResponse<ProjResource>> {
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

    const query = this.projResourceRepository.createQueryBuilder('projResource');

    query
      .leftJoin('projResource.project', 'project')
      .where('project.id = :projectId', { projectId: project.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('projResource.createdAt', 'DESC');

    if (search) {
      query.andWhere(`projResource.name ILIKE :search`, { search: `%${search}%` });
    }


    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`projResource.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }


    if (createdAfter) {
      query.andWhere('projResource.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('projResource.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('projResource.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('projResource.updatedAt <= :updatedBefore', { updatedBefore });
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
    project: Pick<Project, 'id'>,
    id: number,
  ): Promise<ProjResource> {
    const projResource = await this.projResourceRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!projResource) {
      throw new NotFoundException(`ProjResource with ID ${id} not found.`);
    }

    if (projResource.project.id !== project.id) {
      throw new BadRequestException('You are not authorized to access this project resource.');
    }

    return projResource;
  }

  async find(
    project: Pick<Project, 'id'>,
    ids: number[],
  ): Promise<ProjResource[]> {
    const projResources = await this.projResourceRepository.find({
      where: { id: In(ids) },
      relations: ['project'],
    });

    if (!projResources.length) {
      throw new NotFoundException(`No ProjResources found for given IDs.`);
    }

    const unauthorized = projResources.find(
      (res) => res.project.id !== project.id,
    );

    if (unauthorized) {
      throw new BadRequestException(
        'One or more project resources do not belong to the specified project.',
      );
    }

    return projResources;
  }

  async update(
    department: Pick<Department, 'id'>,
    project: Pick<Project, 'id'>,
    id: number,
    updateProjResourceDto: UpdateProjResourceDto,
  ): Promise<MessageResponse> {
    const projResource = await this.findOne(project, id);


    if (updateProjResourceDto.name && updateProjResourceDto.name !== projResource.name) {
      const existing = await this.projResourceRepository.findOne({
        where: { name: updateProjResourceDto.name, id: Not(projResource.id), project: { id: project.id } },
      });

      if (existing) {
        throw new BadRequestException('A project resource with this name already exists.');
      }
    }

    const {
      depReourceId,
      name,
      role,
    } = updateProjResourceDto;

    let depResource = projResource.depResource;

    if (depReourceId && depReourceId !== projResource.depResource?.id) {
      depResource = await this.depResourceServices.findOne(department, depReourceId);
    }


    const updated = this.projResourceRepository.merge(projResource, { depResource, name, role });
    await this.projResourceRepository.save(updated);

    return { message: 'ProjResource updated successfully.' };
  }

  async remove(project: Pick<Project, 'id'>, id: number): Promise<void> {
    const projResource = await this.findOne(project, id);
    await this.projResourceRepository.remove(projResource);
  }
}
