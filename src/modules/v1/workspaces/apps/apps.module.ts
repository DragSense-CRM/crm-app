import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';


import { Workspace } from '../entities/workspace.entity';
import { BlueprintsModule } from '../blueprints/blueprints.module';
import { App } from './entities/app.entity';

import { FieldValidationPipe } from '../pipes/blueprint-validation-pipe';
import { WorkspacesService } from '../workspaces.service';
import { AppDynamicEntitiesRecordsModule } from './app-dynamic-entities-records/app-dynamic-entities-records.module';


@Module({
  imports: [TypeOrmModule.forFeature([Workspace, App]), BlueprintsModule, AppDynamicEntitiesRecordsModule],
  exports: [],
  controllers: [AppsController],
  providers: [AppsService, WorkspacesService, FieldValidationPipe],

})
export class AppsModule { }
