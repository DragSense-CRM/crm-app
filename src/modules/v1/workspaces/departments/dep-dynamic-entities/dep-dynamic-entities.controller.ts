import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, HttpCode, HttpStatus, ParseIntPipe, Query, UsePipes
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
  ApiBody, ApiBearerAuth
} from '@nestjs/swagger';

import { DepDynamicEntitiesService } from './dep-dynamic-entities.service';
import { DepDynamicEntity } from './entities/dep-dynamic-entity.entity';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../gaurds/workspace-gaurd';
import { DepartmentGuard } from '../gaurds/department-gaurd';

import { ReqDepartment } from '../decorators/project.decorator';
import { ReqWorkspace } from '../../decorators/workspace.decorator';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateDepDynamicEntityDto } from './dto/create-dep-dynamic-entity.dto';
import { UpdateDepDynamicEntityDto } from './dto/update-dep-dynamic-entity.dto';
import { DepDynamicEntityPaginatedDto } from './dto/dep-dynamic-entity-response.dto';
import { DepDynamicEntityListDto } from './dto/dep-dynamic-entity-list.dto';
import { DepDynamicEntityQueryDto } from './dto/dep-dynamic-entity-query.dto';



@UseGuards(JwtAuthGuard, WorkspaceGuard, DepartmentGuard)
@ApiBearerAuth('access-token')
@ApiTags('Department Dynamic Entities')
@ApiParam({ name: 'departmentId', type: Number })
@Controller('departments/:departmentId/dep-dynamic-entities')
export class DepDynamicEntitiesController {
  constructor(private readonly depDynamicEntitiesService: DepDynamicEntitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new department dynamic entity' })
  @ApiBody({ type: CreateDepDynamicEntityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Department dynamic entity created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed'
  })
  create(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqDepartment() department: any,
    @Body() createDepDynamicEntityDto: CreateDepDynamicEntityDto
  ) {
    return this.depDynamicEntitiesService.create(workspace, department, createDepDynamicEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all department dynamic entities in department' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of department dynamic entities',
    type: DepDynamicEntityPaginatedDto
  })
  findAll(
    @ReqDepartment() department: any,
    @Query() queryDto: DepDynamicEntityListDto
  ) {
    return this.depDynamicEntitiesService.findAll(department, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department dynamic entity details' })
  @ApiParam({ name: 'id', description: 'Department dynamic Entity ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department dynamic entity details',
    type: DepDynamicEntity
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Department dynamic entity not found'
  })
  findOne(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.depDynamicEntitiesService.findOne(department, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department dynamic entity' })
  @ApiParam({ name: 'id', description: 'Department dynamic Entity ID', type: Number })
  @ApiBody({ type: UpdateDepDynamicEntityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department dynamic entity updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Department dynamic entity not found'
  })
  update(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepDynamicEntityDto: UpdateDepDynamicEntityDto
  ) {
    return this.depDynamicEntitiesService.update(department, id, updateDepDynamicEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department dynamic entity and its table' })
  @ApiParam({ name: 'id', description: 'Department dynamic Entity ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Department dynamic entity deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Department dynamic entity not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.depDynamicEntitiesService.remove(workspace, department, id);
  }
}
