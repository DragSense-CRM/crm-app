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

import { ReqWorkspace } from '../decorators/workspace.decorator';


import { JwtAuthGuard } from '../../auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../gaurds/workspace-gaurd';

import { Resource } from './entities/resource.entity';
import { ResourcesService } from './resources.service';

import { MessageResponseDto } from '@/shared-dto/general.dto';

import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourcePaginatedDto } from './dto/resource-response.dto';
import { ResourceListDto } from './dto/resource-list.dto';

import { BlueprintValidationPipe } from '../pipes/blueprint-validation-pipe';



@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiBearerAuth('access-token')
@ApiTags('Resources')
@ApiParam({ name: 'workspaceId', type: Number })
@Controller('workspaces/:workspaceId/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService,
    private readonly configService: ConfigService,
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiBody({
    type: CreateResourceDto
  })
  @ApiResponse({ status: 201, description: 'Resource created', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UsePipes(BlueprintValidationPipe)
  async create(
    @ReqWorkspace() workspace: any,
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    return this.resourcesService.create(workspace, createResourceDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of resources',
    type: ResourcePaginatedDto,
  })
  findAll(@ReqWorkspace() workspace: any, @Query() queryDto: ResourceListDto) {
    return this.resourcesService.findAll(workspace, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID', type: Number })
  @ApiResponse({ status: 200, description: 'Resource found', type: Resource })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  findOne(@ReqWorkspace() workspace: any, @Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOne(workspace, id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update a resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID', type: Number })
  @ApiBody({ type: UpdateResourceDto })
  @ApiResponse({ status: 200, description: 'Resource updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
    @UploadedFile() file?: Express.Multer.File,

  ) {
    return this.resourcesService.update(workspace, id, updateResourceDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID', type: Number })
  @ApiResponse({ status: 200, description: 'Resource deleted' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@ReqWorkspace() workspace: any, @Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.remove(workspace, id);
  }
}