import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PaginationResponse } from '@/interfaces/pagination-response.interface';
import { MessageResponse } from '@/interfaces/general.interface';

import { Task } from './entities/task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskListDto } from './dto/task-list.dto';
import { Project } from '../entities/project.entity';
import { TaskStatus } from './enums/task.enum';
import { ProjResourcesService } from '../proj-resources/proj-resources.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projecResourcesService: ProjResourcesService
  ) { }

  async create(
    project: Pick<Project, 'id'>,
    createTaskDto: CreateTaskDto,
  ): Promise<MessageResponse> {


    const existing = await this.taskRepository.findOne({
      where: { title: createTaskDto.title, project: { id: project.id } },
    });

    if (existing) {
      throw new BadRequestException('A task with this title already exists.');
    }

    const {
      assigneeId,
      collaboratorIds,
      ...rest
    } = createTaskDto;

    let assignee;
    if (assigneeId) {
      assignee = await this.projecResourcesService.findOne(project, assigneeId)
    }

    let collaborators;
    if (collaboratorIds && collaboratorIds.length > 0) {
      collaborators = await this.projecResourcesService.find(project, collaboratorIds);
    }

    const task = this.taskRepository.create({
      ...rest,
      assignee,
      collaborators,
      project,
    });

    await this.taskRepository.save(task);

    return { message: 'Task created successfully' };
  }

  async findAll(
    project: Pick<Project, 'id'>,
    queryDto: TaskListDto,
  ): Promise<PaginationResponse<Task>> {
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

    const query = this.taskRepository.createQueryBuilder('task')
      .leftJoin('task.project', 'project')
      .where('project.id = :projectId', { projectId: project.id })
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('task.createdAt', 'DESC');

    if (search) {
      query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        const coercedValue = !isNaN(value as any) ? Number(value) : value;
        if (coercedValue) {
          query.andWhere(`task.${key} = :${key}`, { [key]: coercedValue });
        }
      });
    }

    if (createdAfter) {
      query.andWhere('resource.createdAt >= :createdAfter', { createdAfter });
    }

    if (createdBefore) {
      query.andWhere('resource.createdAt <= :createdBefore', { createdBefore });
    }

    if (updatedAfter) {
      query.andWhere('resource.updatedAt >= :updatedAfter', { updatedAfter });
    }

    if (updatedBefore) {
      query.andWhere('resource.updatedAt <= :updatedBefore', { updatedBefore });
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
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project', 'assignee', 'collaborators'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.project.id !== project.id) {
      throw new BadRequestException('You are not authorized to access this task');
    }

    return task;
  }

  async update(
    project: Pick<Project, 'id'>,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<MessageResponse> {
    const task = await this.findOne(project, id);

    if (updateTaskDto.completionPercentage === 100) {
      updateTaskDto.status = TaskStatus.DONE;
    }

    if (updateTaskDto.title && updateTaskDto.title !== task.title) {
      const existing = await this.taskRepository.findOne({
        where: { title: updateTaskDto.title, id: Not(task.id), project: { id: project.id } },
      });

      if (existing) {
        throw new BadRequestException('A task with this title already exists.');
      }
    }

    const updatedTask = this.taskRepository.merge(task, updateTaskDto);
    await this.taskRepository.save(updatedTask);

    return { message: 'Task updated successfully' };
  }

  async remove(
    project: Pick<Project, 'id'>,
    id: number,
  ): Promise<void> {
    const task = await this.findOne(project, id);

    // Optional: Check for dependent entities before deletion
    // if (task.subtasks?.length) {
    //   throw new BadRequestException(
    //     'Cannot delete task with associated subtasks',
    //   );
    // }

    await this.taskRepository.remove(task);
  }
}