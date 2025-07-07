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

import { DepResourcesService } from './dep-resources.service';

import { ReqWorkspace } from '../../decorators/workspace.decorator';
import { ReqDepartment } from '../decorators/project.decorator';
import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../gaurds/workspace-gaurd';
import { DepartmentGuard } from '../gaurds/department-gaurd';

import { DepResource } from './entities/dep-resource.entity';


import { MessageResponseDto } from '@/shared-dto/general.dto';

import { CreateDepResourceDto } from './dto/create-dep-resource.dto';
import { UpdateDepResourceDto } from './dto/update-dep-resource.dto';
import { DepResourceListDto } from './dto/dep-resource-list.dto';
import { DepResourceQueryDto } from './dto/dep-resource-query.dto';
import { DepResourcePaginatedDto } from './dto/dep-resource-response.dto';

import { BlueprintValidationPipe } from '../../pipes/blueprint-validation-pipe';


@UseGuards(JwtAuthGuard, WorkspaceGuard, DepartmentGuard)
@ApiBearerAuth('access-token')
@ApiTags('Department Resourcess')
@ApiParam({ name: 'departmentId', type: Number })
@Controller('departments/:departmentId/dep-resources')
export class DepResourcesController {
  constructor(private readonly depResourcesService: DepResourcesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a department resource' })
  @ApiBody({ type: CreateDepResourceDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Department resource created successfully',
    type: DepResource,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @UsePipes(BlueprintValidationPipe)
  create(
    @Query() queryDto: DepResourceQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqDepartment() department: any,
    @Body() createDepResourceDto: CreateDepResourceDto,
  ) {
    return this.depResourcesService.create(workspace, department, createDepResourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all department resources' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of department resources',
    type: DepResourcePaginatedDto,
  })
  findAll(@ReqDepartment() department: any, @Query() queryDto: DepResourceListDto) {
    return this.depResourcesService.findAll(department, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department resource by ID' })
  @ApiParam({ name: 'id', description: 'DepResource ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department resource found',
    type: DepResource,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'DepResource not found' })
  findOne(
    @Query() queryDto: DepResourceQueryDto,
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.depResourcesService.findOne(department, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department resource' })
  @ApiParam({ name: 'id', description: 'DepResource ID', type: Number })
  @ApiBody({ type: UpdateDepResourceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Department resource updated',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'DepResource not found' })
  @UsePipes(BlueprintValidationPipe)
  update(
    @Query() queryDto: DepResourceQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepResourceDto: UpdateDepResourceDto
  ) {
    return this.depResourcesService.update(workspace, department, id, updateDepResourceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department resource' })
  @ApiParam({ name: 'id', description: 'DepResource ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'DepResource deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'DepResource not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Query() queryDto: DepResourceQueryDto,
    @ReqDepartment() department: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.depResourcesService.remove(department, id);
  }
}
