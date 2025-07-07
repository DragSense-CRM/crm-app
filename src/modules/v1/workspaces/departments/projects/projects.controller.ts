import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { ReqDepartment } from '../decorators/project.decorator';
import { ReqWorkspace } from '../../decorators/workspace.decorator';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../gaurds/workspace-gaurd';
import { DepartmentGuard } from '../gaurds/department-gaurd';


import { ProjectsService } from './projects.service';

import { Project } from './entities/project.entity';

import { MessageResponseDto } from '@/shared-dto/general.dto';


import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectPaginatedDto } from './dto/project-response.dto';
import { ProjectListDto } from './dto/project-list.dto';

import { BlueprintValidationPipe } from '../../pipes/blueprint-validation-pipe';




@UseGuards(JwtAuthGuard, WorkspaceGuard, DepartmentGuard)
@ApiBearerAuth('access-token')
@ApiTags('Projects')
@ApiParam({ name: 'departmentId', type: Number })
@Controller('departments/:departmentId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed'
  })
  @UsePipes(BlueprintValidationPipe)
  create(
    @ReqWorkspace () workspace: any,
    @ReqDepartment() department: any,
    @Body() createProjectDto: CreateProjectDto
  ) {
    return this.projectsService.create(workspace, department, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of projects',
    type: ProjectPaginatedDto
  })
  findAll(
    @ReqDepartment() department: any,
    @Query() queryDto: ProjectListDto
  ) {
    return this.projectsService.findAll(department, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project details',
    type: Project
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found'
  })
  findOne(
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.projectsService.findOne(department, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found'
  })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectsService.update(department, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Project deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.projectsService.remove(department, id);
  }
}