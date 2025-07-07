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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ProjResourcesService } from './proj-resources.service';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../../gaurds/workspace-gaurd';
import { DepartmentGuard } from '../../gaurds/department-gaurd';
import { ProjectGuard } from '../gaurds/project-gaurd';
import { ReqDepartment } from '../../decorators/project.decorator';
import { ReqProject } from '../decorators/project.decorator';


import { ProjResource } from './entities/proj-resource.entity';


import { MessageResponseDto } from '@/shared-dto/general.dto';

import { CreateProjResourceDto } from './dto/create-proj-resource.dto';
import { UpdateProjResourceDto } from './dto/update-proj-resource.dto';
import { ProjResourceListDto } from './dto/proj-resource-list.dto';
import { ProjResourcePaginatedDto } from './dto/proj-resource-response.dto';
import { ProjResourceQueryDto } from './dto/proj-resource-query.dto';

import { BlueprintValidationPipe } from '../../../pipes/blueprint-validation-pipe';



@UseGuards(JwtAuthGuard, WorkspaceGuard, DepartmentGuard, ProjectGuard)
@ApiBearerAuth('access-token')
@ApiTags('Project Resourcess')
@ApiParam({ name: 'projectId', type: Number })
@Controller('projects/:projectId/proj-resources')
export class ProjResourcesController {
  constructor(private readonly projResourcesService: ProjResourcesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a project resource' })
  @ApiBody({ type: CreateProjResourceDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Projartment resource created successfully',
    type: ProjResource,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @UsePipes(BlueprintValidationPipe)
  create(
    @Query() queryDto: ProjResourceQueryDto,
    @ReqDepartment() department: any,
    @ReqProject() project: any,
    @Body() createProjResourceDto: CreateProjResourceDto
  ) {
    return this.projResourcesService.create(department, project, createProjResourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all project resources' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of project resources',
    type: ProjResourcePaginatedDto,
  })
  findAll(@ReqProject() project: any, @Query() queryDto: ProjResourceListDto) {
    return this.projResourcesService.findAll(project, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project resource by ID' })
  @ApiParam({ name: 'id', description: 'ProjResource ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projartment resource found',
    type: ProjResource,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'ProjResource not found' })
  findOne(
    @Query() queryDto: ProjResourceQueryDto,
    @ReqProject() project: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.projResourcesService.findOne(project, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project resource' })
  @ApiParam({ name: 'id', description: 'ProjResource ID', type: Number })
  @ApiBody({ type: UpdateProjResourceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projartment resource updated',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'ProjResource not found' })
  @UsePipes(BlueprintValidationPipe)
  update(
    @Query() queryDto: ProjResourceQueryDto,
    @ReqDepartment() department: any,
    @ReqProject() project: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjResourceDto: UpdateProjResourceDto
  ) {
    return this.projResourcesService.update(department, project, id, updateProjResourceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project resource' })
  @ApiParam({ name: 'id', description: 'ProjResource ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'ProjResource deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'ProjResource not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Query() queryDto: ProjResourceQueryDto,
    @ReqProject() project: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.projResourcesService.remove(project, id);
  }
}
