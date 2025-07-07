import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { DepResource } from './entities/dep-resource.entity';
import { Department } from '../entities/department.entity';

import { MessageResponse } from '@/interfaces/general.interface';
import { PaginationResponse } from '@/interfaces/pagination-response.interface';

import { CreateDepResourceDto } from './dto/create-dep-resource.dto';
import { UpdateDepResourceDto } from './dto/update-dep-resource.dto';
import { DepResourceListDto } from './dto/dep-resource-list.dto';

import { ResourcesService } from '../../resources/resources.service';
import { Workspace } from '../../entities/workspace.entity';

@Injectable()
export class DepResourcesService {
  constructor(
    @InjectRepository(DepResource)
    private readonly depResourceRepository: Repository<DepResource>,
    private readonly resourceService: ResourcesService
  ) { }

  async create(
    workspace: Pick<Workspace, 'id'>,
    department: Pick<Department, 'id'>,
    createDepResourceDto: CreateDepResourceDto,
  ): Promise<MessageResponse> {

    let exists = await this.depResourceRepository.findOne({
      where: { name: createDepResourceDto.name, department: { id: department.id } },
    })

    if (exists) {
      throw new BadRequestException('A department resource with this name already exists.');
    }

    const {
      resourceId,
      isActive,
      designation,
      type,
    } = createDepResourceDto;

    const resource = await this.resourceService.findOne(workspace, resourceId);


    const depResource = this.depResourceRepository.create({
      designation,
      isActive,
      type,
      resource,
      department,
    });

    await this.depResourceRepository.save(depResource);

    return { message: 'Department resource created successfully.' };
  }

  async findAll(
    department: Pick<Department, 'id'>,
    queryDto: DepResourceListDto,
  ): Promise<PaginationResponse<DepResource>> {
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

    const query = this.depResourceRepository.createQueryBuilder('depResource');

    query
      .leftJoin('depResource.department', 'department')
      .where('department.id = :departmentId', { departmentId: department.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('depResource.createdAt', 'DESC');

    if (search) {
      query.andWhere(`depResource.name ILIKE :search`, { search: `%${search}%` });
    }


    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`depResource.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }


    if (createdAfter) {
      query.andWhere('depResource.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('depResource.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('depResource.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('depResource.updatedAt <= :updatedBefore', { updatedBefore });
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
  ): Promise<DepResource> {
    const depResource = await this.depResourceRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!depResource) {
      throw new NotFoundException(`DepResource with ID ${id} not found.`);
    }

    if (depResource.department.id !== department.id) {
      throw new BadRequestException('You are not authorized to access this department resource.');
    }

    return depResource;
  }

  async update(
    workspace: Pick<Workspace, 'id'>,
    department: Pick<Department, 'id'>,
    id: number,
    updateDepResourceDto: UpdateDepResourceDto,
  ): Promise<MessageResponse> {
    const depResource = await this.findOne(department, id);


    if (updateDepResourceDto.name && updateDepResourceDto.name !== depResource.name) {
      const existing = await this.depResourceRepository.findOne({
        where: { name: updateDepResourceDto.name, id: Not(depResource.id), department: { id: department.id } },
      });

      if (existing) {
        throw new BadRequestException('A department resource with this name already exists.');
      }
    }


    const {
      resourceId,
      isActive,
      designation,
      type,
    } = updateDepResourceDto;

    let resource = depResource.resource;

    if (resourceId && resourceId !== depResource.resource?.id) {
      resource = await this.resourceService.findOne(workspace, resourceId);
    }


    const updated = this.depResourceRepository.merge(depResource, {
      isActive,
      designation,
      type,
      resource
    });
    await this.depResourceRepository.save(updated);

    return { message: 'DepResource updated successfully.' };
  }

  async remove(department: Pick<Department, 'id'>, id: number): Promise<void> {
    const depResource = await this.findOne(department, id);
    await this.depResourceRepository.remove(depResource);
  }
}
