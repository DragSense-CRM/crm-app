import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../gaurds/workspace-gaurd';
import { ReqWorkspace } from '../decorators/workspace.decorator';

import { WSBlueprint } from './schemas/blueprint.schema';


import { MessageResponseDto } from '@/shared-dto/general.dto';

import { BlueprintsService } from './blueprints.service';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { BlueprintPaginatedDto } from './dto/blueprint-response.dto';
import { BlueprintListDto } from './dto/blueprint-list.dto';

@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiBearerAuth('access-token')
@ApiTags('Blueprints')
@ApiParam({ name: 'workspaceId', type: Number })
@Controller('workspaces/:workspaceId/blueprints')
export class BlueprintsController {
  constructor(private readonly blueprintsService: BlueprintsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blueprint' })
  @ApiBody({ type: CreateBlueprintDto })
  @ApiResponse({ status: 201, description: 'WSBlueprint created', type: MessageResponseDto })
  create(
    @ReqWorkspace() workspace: any,
    @Body() createBlueprintDto: CreateBlueprintDto,
  ) {
    return this.blueprintsService.create(workspace, createBlueprintDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blueprints' })
  @ApiResponse({
    status: 200,
        description: 'Paginated list of blueprints',
        type: BlueprintPaginatedDto,
  })
  findAll(@ReqWorkspace() workspace: any, @Query() queryDto: BlueprintListDto) {
    return this.blueprintsService.findAll(workspace, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blueprint by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the blueprint' })
  @ApiResponse({ status: 200, description: 'Single blueprint', type: WSBlueprint })
  @ApiResponse({ status: 404, description: 'WSBlueprint not found' })
  findOne(
    @ReqWorkspace() workspace: any,
    @Param('id') id: string,
  ) {
    return this.blueprintsService.findOne(workspace, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blueprint by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the blueprint' })
  @ApiBody({ type: UpdateBlueprintDto })
  @ApiResponse({ status: 200, description: 'WSBlueprint updated', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'WSBlueprint not found' })
  update(
    @ReqWorkspace() workspace: any,
    @Param('id') id: string,
    @Body() updateBlueprintDto: UpdateBlueprintDto,
  ) {
    return this.blueprintsService.update(workspace, id, updateBlueprintDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blueprint by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the blueprint' })
  @ApiResponse({ status: 200, description: 'WSBlueprint deleted', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'WSBlueprint not found' })
  remove(@ReqWorkspace() workspace: any, @Param('id') id: string) {
    return this.blueprintsService.remove(workspace, id);
  }
}
