import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, HttpCode, HttpStatus, ParseIntPipe, Query, UsePipes
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
  ApiBody, ApiBearerAuth
} from '@nestjs/swagger';

import { ProjDynamicEntitiesService } from './proj-dynamic-entities.service';
import { ProjDynamicEntity } from './entities/proj-dynamic-entity.entity';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../gaurds/workspace-gaurd';
import { ProjartmentGuard } from '../gaurds/projartment-gaurd';

import { ReqProjartment } from '../decorators/project.decorator';
import { ReqWorkspace } from '../../decorators/workspace.decorator';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateProjDynamicEntityDto } from './dto/create-proj-dynamic-entity.dto';
import { UpdateProjDynamicEntityDto } from './dto/update-proj-dynamic-entity.dto';
import { ProjDynamicEntityPaginatedDto } from './dto/proj-dynamic-entity-response.dto';
import { ProjDynamicEntityListDto } from './dto/proj-dynamic-entity-list.dto';
import { ProjDynamicEntityQueryDto } from './dto/proj-dynamic-entity-query.dto';



@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjartmentGuard)
@ApiBearerAuth('access-token')
@ApiTags('Projartment Dynamic Entities')
@ApiParam({ name: 'projartmentId', type: Number })
@Controller('projartments/:projartmentId/proj-dynamic-entities')
export class ProjDynamicEntitiesController {
  constructor(private readonly projDynamicEntitiesService: ProjDynamicEntitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new projartment dynamic entity' })
  @ApiBody({ type: CreateProjDynamicEntityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Projartment dynamic entity created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed'
  })
  create(
    @Query() queryDto: ProjDynamicEntityQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqProjartment() projartment: any,
    @Body() createProjDynamicEntityDto: CreateProjDynamicEntityDto
  ) {
    return this.projDynamicEntitiesService.create(workspace, projartment, createProjDynamicEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projartment dynamic entities in projartment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of projartment dynamic entities',
    type: ProjDynamicEntityPaginatedDto
  })
  findAll(
    @ReqProjartment() projartment: any,
    @Query() queryDto: ProjDynamicEntityListDto
  ) {
    return this.projDynamicEntitiesService.findAll(projartment, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get projartment dynamic entity details' })
  @ApiParam({ name: 'id', description: 'Projartment dynamic Entity ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projartment dynamic entity details',
    type: ProjDynamicEntity
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projartment dynamic entity not found'
  })
  findOne(
    @Query() queryDto: ProjDynamicEntityQueryDto,
    @ReqProjartment() projartment: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.projDynamicEntitiesService.findOne(projartment, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update projartment dynamic entity' })
  @ApiParam({ name: 'id', description: 'Projartment dynamic Entity ID', type: Number })
  @ApiBody({ type: UpdateProjDynamicEntityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projartment dynamic entity updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projartment dynamic entity not found'
  })
  update(
    @Query() queryDto: ProjDynamicEntityQueryDto,
    @ReqProjartment() projartment: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjDynamicEntityDto: UpdateProjDynamicEntityDto
  ) {
    return this.projDynamicEntitiesService.update(projartment, id, updateProjDynamicEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete projartment dynamic entity and its table' })
  @ApiParam({ name: 'id', description: 'Projartment dynamic Entity ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Projartment dynamic entity deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projartment dynamic entity not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Query() queryDto: ProjDynamicEntityQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqProjartment() projartment: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.projDynamicEntitiesService.remove(workspace, projartment, id);
  }
}
