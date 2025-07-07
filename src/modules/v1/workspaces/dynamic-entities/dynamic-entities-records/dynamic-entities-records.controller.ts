import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { getFileUploadConfig } from '@/config';

import { ReqDynamicEntity } from '../decorators/dynamic-entity.decorator';

import { JwtAuthGuard } from '@/modules/v1/auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../../gaurds/workspace-gaurd';
import { DynamicEntitiesGuard } from '../gaurds/dynamic-entity-gaurd';

import { DynamicEntitiesRecordService } from './dynamic-entities-records.service';

import { MessageResponseDto } from '@/shared-dto/general.dto';

import { CreateDynamicEntitiesRecordDto } from './dto/create-dynamic-entities-record.dto';
import { UpdateDynamicEntitiesRecordDto } from './dto/update-dynamic-entities-record.dto';
import { DynamicEntitiesRecordPaginatedDto } from './dto/dynamic-entities-record-response.dto';
import { DynamicEntitiesRecordListDto } from './dto/dynamic-entities-record-list.dto';

import { BlueprintValidationPipe } from '../../pipes/blueprint-validation-pipe';
import { ReqWorkspace } from '../../decorators/workspace.decorator';


@UseGuards(JwtAuthGuard, WorkspaceGuard, DynamicEntitiesGuard)
@ApiBearerAuth('access-token')
@ApiTags('DynamicEntitiesRecord')
@ApiParam({ name: 'dynamicEntityId', type: Number })
@Controller('app/data/:dynamicTable')
export class DynamicEntitiesRecordController {
  constructor(private readonly dynamicEntitiesRecord: DynamicEntitiesRecordService,
    private readonly configService: ConfigService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new dynamic entities record' })
  @ApiBody({
    type: CreateDynamicEntitiesRecordDto
  })
  @ApiResponse({ status: 201, description: 'Dynamic entities record created', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UsePipes(BlueprintValidationPipe)
  async create(
    @ReqWorkspace() workspace: any,
    @ReqDynamicEntity() dynamicEntity: any,
    @Body() createDynamicEntitiesRecordDto: CreateDynamicEntitiesRecordDto,
  ) {

    return this.dynamicEntitiesRecord.create(workspace, dynamicEntity, createDynamicEntitiesRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dynamic entities record' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of dynamic entities record',
    type: DynamicEntitiesRecordPaginatedDto,
  })
  findAll(@ReqWorkspace() workspace: any, @ReqDynamicEntity() dynamicEntity: any, @Query() queryDto: DynamicEntitiesRecordListDto) {
    return this.dynamicEntitiesRecord.findAll(workspace, dynamicEntity, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Dynamic entities record ID', type: Number })
  @ApiResponse({
    status: 200, description: 'Returns a record from the dynamic entity table. The shape depends on the entity schema.',
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
  @ApiResponse({ status: 404, description: 'Dynamic entities record not found' })
  findOne(@ReqWorkspace() workspace: any, @ReqDynamicEntity() dynamicEntity: any, @Param('id') id: string) {
    return this.dynamicEntitiesRecord.findOne(workspace, dynamicEntity, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Dynamic entities record ID', type: Number })
  @ApiBody({ type: UpdateDynamicEntitiesRecordDto })
  @ApiResponse({ status: 200, description: 'Dynamic entities record updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Dynamic entities record not found' })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @ReqDynamicEntity() dynamicEntity: any,
    @Param('id') id: string,
    @Body() updateDynamicEntitiesRecordDto: UpdateDynamicEntitiesRecordDto

  ) {
    return this.dynamicEntitiesRecord.update(workspace, dynamicEntity, id, updateDynamicEntitiesRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dynamic entities record by ID' })
  @ApiParam({ name: 'id', description: 'Dynamic entities record ID', type: Number })
  @ApiResponse({ status: 200, description: 'Dynamic entities record deleted' })
  @ApiResponse({ status: 404, description: 'Dynamic entities record not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@ReqWorkspace() workspace: any,
    @ReqDynamicEntity() dynamicEntity: any,
    @Param('id') id: string) {
    return this.dynamicEntitiesRecord.remove(workspace, dynamicEntity, id);
  }
}