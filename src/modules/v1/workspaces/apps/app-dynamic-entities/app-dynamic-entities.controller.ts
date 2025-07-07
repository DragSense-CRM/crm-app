import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, HttpCode, HttpStatus, ParseIntPipe, Query, UsePipes
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
  ApiBody, ApiBearerAuth
} from '@nestjs/swagger';

import { DepDynamicEntitiesService } from './app-dynamic-entities.service';
import { DepDynamicEntity } from './entities/app-dynamic-entity.entity';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../gaurds/workspace-gaurd';
import { AppGuard } from '../gaurds/app-gaurd';

import { ReqApp } from '../decorators/app.decorator';
import { ReqWorkspace } from '../../decorators/workspace.decorator';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateDepDynamicEntityDto } from './dto/create-app-dynamic-entity.dto';
import { UpdateDepDynamicEntityDto } from './dto/update-app-dynamic-entity.dto';
import { DepDynamicEntityPaginatedDto } from './dto/app-dynamic-entity-response.dto';
import { DepDynamicEntityListDto } from './dto/app-dynamic-entity-list.dto';
import { DepDynamicEntityQueryDto } from './dto/app-dynamic-entity-query.dto';



@UseGuards(JwtAuthGuard, WorkspaceGuard, AppGuard)
@ApiBearerAuth('access-token')
@ApiTags('App Dynamic Entities')
@ApiParam({ name: 'appId', type: Number })
@Controller('apps/:appId/dep-dynamic-entities')
export class DepDynamicEntitiesController {
  constructor(private readonly depDynamicEntitiesService: DepDynamicEntitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new app dynamic entity' })
  @ApiBody({ type: CreateDepDynamicEntityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'App dynamic entity created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed'
  })
  create(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqApp() app: any,
    @Body() createDepDynamicEntityDto: CreateDepDynamicEntityDto
  ) {
    return this.depDynamicEntitiesService.create(workspace, app, createDepDynamicEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all app dynamic entities in app' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of app dynamic entities',
    type: DepDynamicEntityPaginatedDto
  })
  findAll(
    @ReqApp() app: any,
    @Query() queryDto: DepDynamicEntityListDto
  ) {
    return this.depDynamicEntitiesService.findAll(app, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get app dynamic entity details' })
  @ApiParam({ name: 'id', description: 'App dynamic Entity ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'App dynamic entity details',
    type: DepDynamicEntity
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'App dynamic entity not found'
  })
  findOne(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqApp() app: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.depDynamicEntitiesService.findOne(app, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update app dynamic entity' })
  @ApiParam({ name: 'id', description: 'App dynamic Entity ID', type: Number })
  @ApiBody({ type: UpdateDepDynamicEntityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'App dynamic entity updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'App dynamic entity not found'
  })
  update(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqApp() app: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepDynamicEntityDto: UpdateDepDynamicEntityDto
  ) {
    return this.depDynamicEntitiesService.update(app, id, updateDepDynamicEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete app dynamic entity and its table' })
  @ApiParam({ name: 'id', description: 'App dynamic Entity ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'App dynamic entity deleted successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'App dynamic entity not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Query() queryDto: DepDynamicEntityQueryDto,
    @ReqWorkspace() workspace: any,
    @ReqApp() app: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.depDynamicEntitiesService.remove(workspace, app, id);
  }
}
