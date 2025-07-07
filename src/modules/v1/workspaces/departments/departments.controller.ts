import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, HttpCode, HttpStatus, ParseIntPipe, Query, UsePipes
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
  ApiBody, ApiBearerAuth
} from '@nestjs/swagger';

import { ReqWorkspace } from '../decorators/workspace.decorator';

import { JwtAuthGuard } from '../../auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../gaurds/workspace-gaurd';

import { Department } from './entities/department.entity';
import { DepartmentsService } from './departments.service';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentPaginatedDto } from './dto/department-response.dto';
import { DepartmentListDto } from './dto/department-list.dto';


import { BlueprintValidationPipe } from '../pipes/blueprint-validation-pipe';



@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiBearerAuth('access-token')
@ApiTags('Departments')
@ApiParam({ name: 'workspaceId', type: Number })
@Controller('workspaces/:workspaceId/departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Department created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation failed' 
  })
  @UsePipes(BlueprintValidationPipe)
  create(
    @ReqWorkspace() workspace: any,
    @Body() createDepartmentDto: CreateDepartmentDto
  ) {
    return this.departmentsService.create(workspace, createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments in workspace' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Paginated list of departments',
    type: DepartmentPaginatedDto
  })
  findAll(
    @ReqWorkspace() workspace: any,
    @Query() queryDto: DepartmentListDto
  ) {
    return this.departmentsService.findAll(workspace, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department details' })
  @ApiParam({ name: 'id', description: 'Department ID', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Department details',
    type: Department
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Department not found'
  })
  findOne(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.departmentsService.findOne(workspace, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department' })
  @ApiParam({ name: 'id', description: 'Department ID', type: Number })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Department updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Department not found'
  })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ) {
    return this.departmentsService.update(workspace, id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  @ApiParam({ name: 'id', description: 'Department ID', type: Number })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT,
    description: 'Department deleted successfully'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Department not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.departmentsService.remove(workspace, id);
  }
}