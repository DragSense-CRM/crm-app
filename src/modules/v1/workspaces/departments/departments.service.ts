import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Department } from './entities/department.entity';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentListDto } from './dto/department-list.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  async create(
    workspace: Pick<Workspace, 'id'>,
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<MessageResponse> {
    const existing = await this.departmentRepository.findOne({
      where: { name: createDepartmentDto.name, workspace: { id: workspace.id } },
    });

    if (existing) {
      throw new BadRequestException('A department with this name already exists.');
    }

    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      workspace,
    });

    await this.departmentRepository.save(department);

    return { message: 'Department created successfully.' };
  }

  async findAll(
    workspace: Pick<Workspace, 'id'>,
    queryDto: DepartmentListDto,
  ): Promise<PaginationResponse<Department>> {
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

    const query = this.departmentRepository.createQueryBuilder('department')
      .leftJoin('department.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId: workspace.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('department.createdAt', 'DESC');

    if (search) {
      query.andWhere(
        '(department.name ILIKE :search OR department.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`department.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('department.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('department.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('department.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('department.updatedAt <= :updatedBefore', { updatedBefore });
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
  ): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['workspace'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found.`);
    }

    if (department.workspace.id !== workspace.id) {
      throw new BadRequestException('You are not authorized to access this department.');
    }

    return department;
  }

  async update(
    workspace: Pick<Workspace, 'id'>,
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<MessageResponse> {
    const department = await this.findOne(workspace, id);


    if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
      const existing = await this.departmentRepository.findOne({
        where: { name: updateDepartmentDto.name, id: Not(department.id), workspace: { id: workspace.id } },
      });

    if (existing) {
      throw new BadRequestException('A department with this name already exists.');
    }
  }

  const updated = this.departmentRepository.merge(department, updateDepartmentDto);
    await this.departmentRepository.save(updated);

return { message: 'Department updated successfully.' };
  }

  async remove(
  workspace: Pick<Workspace, 'id'>,
  id: number,
): Promise < void> {
  const department = await this.findOne(workspace, id);

  // Check if department has any projects (optional)
  // const hasProjects = await this.projectRepository.exists({ where: { department: { id } } });
  // if (hasProjects) {
  //   throw new BadRequestException('Cannot delete department with associated projects.');
  // }

  await this.departmentRepository.remove(department);
}

}