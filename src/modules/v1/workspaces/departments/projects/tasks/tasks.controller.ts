import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UsePipes
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiBody, ApiBearerAuth
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { ProjectGuard } from '../gaurds/project-gaurd';
import { ReqProject } from '../decorators/project.decorator';
import { WorkspaceGuard } from '../../../gaurds/workspace-gaurd';
import { DepartmentGuard } from '../../gaurds/department-gaurd';


import { MessageResponseDto } from '@/shared-dto/general.dto';

import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPaginatedDto } from './dto/task-response.dto';
import { TaskListDto } from './dto/task-list.dto';
import { TaskQueryDto } from './dto/task-query.dto';

import { BlueprintValidationPipe } from '../../../pipes/blueprint-validation-pipe';


@UseGuards(JwtAuthGuard, WorkspaceGuard, DepartmentGuard, ProjectGuard)
@ApiBearerAuth('access-token')
@ApiTags('Tasks')
@ApiParam({ name: 'projectId', type: Number })
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed'
  })
  @UsePipes(BlueprintValidationPipe)
  create(
    @Query() queryDto: TaskQueryDto,
    @ReqProject() project: any,
    @Body() createTaskDto: CreateTaskDto
  ) {
    return this.tasksService.create(project, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of tasks',
    type: TaskPaginatedDto
  })
  findAll(
    @ReqProject() project: any,
    @Query() queryDto: TaskListDto
  ) {
    return this.tasksService.findAll(project, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task details',
    type: Task
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found'
  })
  findOne(
    @Query() queryDto: TaskQueryDto,
    @ReqProject() project: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.tasksService.findOne(project, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found'
  })
  @UsePipes(BlueprintValidationPipe)
  update(
    @Query() queryDto: TaskQueryDto,
    @ReqProject() project: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(project, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Query() queryDto: TaskQueryDto,
    @ReqProject() project: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.tasksService.remove(project, id);
  }
}