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



import { JwtAuthGuard } from '../../auth/gaurds/jwt-auth.gaurd';
import { WorkspaceGuard } from '../gaurds/workspace-gaurd';
import { ReqWorkspace } from '../decorators/workspace.decorator';


import { App } from './entities/app.entity';


import { MessageResponseDto } from '@/shared-dto/general.dto';
import { AppsService } from '../apps/apps.service';
import { CreateAppDto } from '../apps/dto/create-app.dto';
import { AppPaginatedDto } from './dto/app-response.dto';
import { AppListDto } from './dto/app-list.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { BlueprintValidationPipe } from '../pipes/blueprint-validation-pipe';

@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiBearerAuth('access-token')
@ApiTags('Apps')
@ApiParam({ name: 'workspaceId', type: Number })
@Controller('workspaces/:workspaceId/apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new app' })
  @ApiBody({ type: CreateAppDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'App created successfully',
    type: MessageResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @UsePipes(BlueprintValidationPipe)
  create(
    @ReqWorkspace() workspace: any,
    @Body() createAppDto: CreateAppDto,
  ) {
    return this.appsService.create(workspace, createAppDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all apps in workspace' })
  @ApiResponse({
    status: HttpStatus.OK,
   description: 'Paginated list of apps',
      type: AppPaginatedDto
  })
  findAll(@ReqWorkspace() workspace: any, @Query() queryDto: AppListDto) {
    return this.appsService.findAll(workspace, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get app details' })
  @ApiParam({ name: 'id', description: 'App ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'App details',
    type: App,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'App not found',
  })
  findOne(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.appsService.findOne(workspace, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update app' })
  @ApiParam({ name: 'id', description: 'App ID', type: Number })
  @ApiBody({ type: UpdateAppDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'App updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'App not found',
  })
  @UsePipes(BlueprintValidationPipe)
  update(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppDto: UpdateAppDto,
  ) {
    return this.appsService.update(workspace, id, updateAppDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete app' })
  @ApiParam({ name: 'id', description: 'App ID', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'App deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'App not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ReqWorkspace() workspace: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.appsService.remove(workspace, id);
  }
}
