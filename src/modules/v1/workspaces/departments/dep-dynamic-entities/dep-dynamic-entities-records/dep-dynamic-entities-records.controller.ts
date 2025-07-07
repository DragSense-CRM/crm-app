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
import { DepartmentGuard } from '../../gaurds/department-gaurd';
import { DepDynamicEntitiesGuard } from '../gaurds/dep-dynamic-entity-gaurd';
import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';

import { MessageResponseDto } from '@/shared-dto/general.dto';
import { CreateDynamicEntitiesRecordDto } from '../../../dynamic-entities/dynamic-entities-records/dto/create-dynamic-entities-record.dto';
import { ReqDepDynamicEntity } from '../decorators/dep-dynamic-entity.decorator';


import { DepDynamicEntitiesRecordService } from './dep-dynamic-entities-records.service';
import { BlueprintValidationPipe } from '../../../pipes/blueprint-validation-pipe';
import { DynamicEntitiesRecordPaginatedDto } from '../../../dynamic-entities/dynamic-entities-records/dto/dynamic-entities-record-response.dto';
import { DynamicEntitiesRecordListDto } from '../../../dynamic-entities/dynamic-entities-records/dto/dynamic-entities-record-list.dto';
import { UpdateDynamicEntitiesRecordDto } from '../../../dynamic-entities/dynamic-entities-records/dto/update-dynamic-entities-record.dto';
import { ReqWorkspace } from '../../../decorators/workspace.decorator';

@UseGuards(JwtAuthGuard, WorkspaceGuard, DepartmentGuard, DepDynamicEntitiesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Department Dynamic Entities Record')
@ApiParam({ name: 'dynamicEntityId', type: Number })
@Controller('department/data/:dynamicEntityId')
export class DepDynamicEntitiesRecordController {
  constructor(private readonly dynamicEntitiesRecord: DepDynamicEntitiesRecordService,
    private readonly configService: ConfigService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new department dynamic entities record' })
  @ApiBody({
    type: CreateDynamicEntitiesRecordDto
  })
  @ApiResponse({ status: 201, description: 'Department dynamic entities record created', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UsePipes(BlueprintValidationPipe)
  async create(
    @ReqWorkspace() workspace: any,
    @ReqDepDynamicEntity() depDynamicEntity: any,
    @Body() createDynamicEntitiesRecordDto: CreateDynamicEntitiesRecordDto,
  ) {

    return this.dynamicEntitiesRecord.create(workspace, depDynamicEntity, createDynamicEntitiesRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all department dynamic entities record' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of department dynamic entities record',
    type: DynamicEntitiesRecordPaginatedDto,
  })
  findAll(@ReqWorkspace() workspace: any, @ReqDepDynamicEntity() depDynamicEntity: any, @Query() queryDto: DynamicEntitiesRecordListDto) {
    return this.dynamicEntitiesRecord.findAll(workspace, depDynamicEntity, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Department dynamic entities record ID', type: Number })
  @ApiResponse({
    status: 200, description: 'Returns a record from the department dynamic entity table. The shape depends on the entity schema.',
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
  @ApiResponse({ status: 404, description: 'Department dynamic entities record not found' })
  findOne(@ReqWorkspace() workspace: any, @ReqDepDynamicEntity() depDynamicEntity: any,@Param('id') id: string) {
    return this.dynamicEntitiesRecord.findOne(workspace, depDynamicEntity, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Department dynamic entities record ID', type: Number })
  @ApiBody({ type: UpdateDynamicEntitiesRecordDto })
  @ApiResponse({ status: 200, description: 'Department dynamic entities record updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Department dynamic entities record not found' })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @ReqDepDynamicEntity() depDynamicEntity: any,
    @Param('id') id: string,
    @Body() updateDepDynamicEntitiesRecordDto: UpdateDynamicEntitiesRecordDto

  ) {
    return this.dynamicEntitiesRecord.update(workspace, depDynamicEntity, id, updateDepDynamicEntitiesRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Department dynamic entities record ID', type: Number })
  @ApiResponse({ status: 200, description: 'Department dynamic entities record deleted' })
  @ApiResponse({ status: 404, description: 'Department dynamic entities record not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@ReqWorkspace() workspace: any, @ReqDepDynamicEntity() depDynamicEntity: any, @Param('id') id: string) {
    return this.dynamicEntitiesRecord.remove(workspace, depDynamicEntity, id);
  }
}