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

import { DynamicEntitiesService } from './dynamic-entities.service';
import { DynamicEntity } from './entities/dynamic-entity.entity';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import { UpdateDynamicEntityDto } from './dto/update-dynamic-entity.dto';
import { DynamicEntityPaginatedDto } from './dto/dynamic-entity-response.dto';
import { DynamicEntityListDto } from './dto/dynamic-entity-list.dto';

import { BlueprintValidationPipe } from '../pipes/blueprint-validation-pipe';

@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiBearerAuth('access-token')
@ApiTags('Dynamic Entities')
@ApiParam({ name: 'workspaceId', type: Number })
@Controller('workspaces/:workspaceId/dynamic-entities')
export class DynamicEntitiesController {
  constructor(private readonly dynamicEntitiesService: DynamicEntitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dynamic entity' })
  @ApiBody({ type: CreateDynamicEntityDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Dynamic entity created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation failed' 
  })
  @UsePipes(BlueprintValidationPipe)
  create(
    @ReqWorkspace() workspace: any,
    @Body() createDynamicEntityDto: CreateDynamicEntityDto
  ) {
    return this.dynamicEntitiesService.create(workspace, createDynamicEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dynamic entities in workspace' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Paginated list of dynamic entities',
    type: DynamicEntityPaginatedDto
  })
  findAll(
    @ReqWorkspace() workspace: any,
    @Query() queryDto: DynamicEntityListDto
  ) {
    return this.dynamicEntitiesService.findAll(workspace, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dynamic entity details' })
  @ApiParam({ name: 'id', description: 'Dynamic Entity ID', type: Number })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Dynamic entity details',
    type: DynamicEntity
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Dynamic entity not found'
  })
  findOne(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.dynamicEntitiesService.findOne(workspace, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dynamic entity' })
  @ApiParam({ name: 'id', description: 'Dynamic Entity ID', type: Number })
  @ApiBody({ type: UpdateDynamicEntityDto })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Dynamic entity updated successfully',
    type: MessageResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Dynamic entity not found'
  })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDynamicEntityDto: UpdateDynamicEntityDto
  ) {
    return this.dynamicEntitiesService.update(workspace, id, updateDynamicEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dynamic entity and its table' })
  @ApiParam({ name: 'id', description: 'Dynamic Entity ID', type: Number })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT,
    description: 'Dynamic entity deleted successfully'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Dynamic entity not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.dynamicEntitiesService.remove(workspace, id);
  }
}
