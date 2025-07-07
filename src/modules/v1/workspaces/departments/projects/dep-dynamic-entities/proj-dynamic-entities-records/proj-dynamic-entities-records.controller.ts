import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { WorkspaceGuard } from '../../../gaurds/workspace-gaurd';
import { ProjartmentGuard } from '../../gaurds/projartment-gaurd';
import { ProjDynamicEntitiesGuard } from '../gaurds/proj-dynamic-entity-gaurd';
import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateDynamicEntitiesRecordDto } from '../../../dynamic-entities/dynamic-entities-records/dto/create-dynamic-entities-record.dto';
import { ReqProjDynamicEntity } from '../decorators/proj-dynamic-entity.decorator';


import { ProjDynamicEntitiesRecordService } from './proj-dynamic-entities-records.service';
import { BlueprintValidationPipe } from '../../../pipes/blueprint-validation-pipe';
import { DynamicEntitiesRecordPaginatedDto } from '../../../dynamic-entities/dynamic-entities-records/dto/dynamic-entities-record-response.dto';
import { DynamicEntitiesRecordListDto } from '../../../dynamic-entities/dynamic-entities-records/dto/dynamic-entities-record-list.dto';
import { UpdateDynamicEntitiesRecordDto } from '../../../dynamic-entities/dynamic-entities-records/dto/update-dynamic-entities-record.dto';
import { ReqWorkspace } from '../../../decorators/workspace.decorator';

@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjartmentGuard, ProjDynamicEntitiesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Projartment Dynamic Entities Record')
@ApiParam({ name: 'dynamicEntityId', type: Number })
@Controller('projartment/data/:dynamicEntityId')
export class ProjDynamicEntitiesRecordController {
  constructor(private readonly dynamicEntitiesRecord: ProjDynamicEntitiesRecordService,
    private readonly configService: ConfigService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new projartment dynamic entities record' })
  @ApiBody({
    type: CreateDynamicEntitiesRecordDto
  })
  @ApiResponse({ status: 201, description: 'Projartment dynamic entities record created', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UsePipes(BlueprintValidationPipe)
  async create(
    @ReqWorkspace() workspace: any,
    @ReqProjDynamicEntity() projDynamicEntity: any,
    @Body() createDynamicEntitiesRecordDto: CreateDynamicEntitiesRecordDto,
  ) {

    return this.dynamicEntitiesRecord.create(workspace, projDynamicEntity, createDynamicEntitiesRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projartment dynamic entities record' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of projartment dynamic entities record',
    type: DynamicEntitiesRecordPaginatedDto,
  })
  findAll(@ReqWorkspace() workspace: any, @ReqProjDynamicEntity() projDynamicEntity: any, @Query() queryDto: DynamicEntitiesRecordListDto) {
    return this.dynamicEntitiesRecord.findAll(workspace, projDynamicEntity, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a projartment dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Projartment dynamic entities record ID', type: Number })
  @ApiResponse({
    status: 200, description: 'Returns a record from the projartment dynamic entity table. The shape projends on the entity schema.',
    schema: {
      type: 'object',
      additionalProperties: true, // ← This marks it as flexible
      example: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Projartment dynamic entities record not found' })
  findOne(@ReqWorkspace() workspace: any, @ReqProjDynamicEntity() projDynamicEntity: any,@Param('id') id: string) {
    return this.dynamicEntitiesRecord.findOne(workspace, projDynamicEntity, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a projartment dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Projartment dynamic entities record ID', type: Number })
  @ApiBody({ type: UpdateDynamicEntitiesRecordDto })
  @ApiResponse({ status: 200, description: 'Projartment dynamic entities record updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Projartment dynamic entities record not found' })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @ReqProjDynamicEntity() projDynamicEntity: any,
    @Param('id') id: string,
    @Body() updateProjDynamicEntitiesRecordDto: UpdateDynamicEntitiesRecordDto

  ) {
    return this.dynamicEntitiesRecord.update(workspace, projDynamicEntity, id, updateProjDynamicEntitiesRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a projartment dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Projartment dynamic entities record ID', type: Number })
  @ApiResponse({ status: 200, description: 'Projartment dynamic entities record deleted' })
  @ApiResponse({ status: 404, description: 'Projartment dynamic entities record not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@ReqWorkspace() workspace: any, @ReqProjDynamicEntity() projDynamicEntity: any, @Param('id') id: string) {
    return this.dynamicEntitiesRecord.remove(workspace, projDynamicEntity, id);
  }
}