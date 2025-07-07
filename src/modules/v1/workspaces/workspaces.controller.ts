import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { AuthUser } from '@/decorators/user.decorator';

import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.gaurd';

import { WorkspacesService } from './workspaces.service';

import { Workspace } from './entities/workspace.entity';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacePaginatedDto } from './dto/workspace-response.dto';
import { WorkspaceListDto } from './dto/workspace-list.dto';
import { MessageResponseDto } from '@/shared-dto/general.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiBody({ type: CreateWorkspaceDto })
  @ApiResponse({ status: 201, description: 'Workspace created', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@AuthUser() user: any, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(user, createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of workspaces',
    type: WorkspacePaginatedDto,
  })
  findAll(@AuthUser() user: any, @Query() queryDto: WorkspaceListDto) {
    return this.workspacesService.findAll(user, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace ID', type: Number })
  @ApiResponse({ status: 200, description: 'Workspace found', type: Workspace })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  findOne(@AuthUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.workspacesService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace ID', type: Number })
  @ApiBody({ type: UpdateWorkspaceDto })
  @ApiResponse({ status: 200, description: 'Workspace updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  update(
    @AuthUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(user, id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace ID', type: Number })
  @ApiResponse({ status: 200, description: 'Workspace deleted' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@AuthUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.workspacesService.remove(user, id);
  }
}