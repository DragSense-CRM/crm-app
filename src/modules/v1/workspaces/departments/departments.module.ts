import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

import { Workspace } from '../entities/workspace.entity';
import { Department } from './entities/department.entity';

import { BlueprintsModule } from '../blueprints/blueprints.module';

import { WorkspacesService } from '../workspaces.service';
import { DepResourcesModule } from './dep-resources/dep-resources.module';
import { BlueprintValidationPipe } from '../pipes/blueprint-validation-pipe';
import { DepDynamicEntitiesRecordsModule } from './dep-dynamic-entities-records/dep-dynamic-entities-records.module';


@Module({
  imports: [TypeOrmModule.forFeature([Workspace, Department]), BlueprintsModule, DepResourcesModule, DepDynamicEntitiesRecordsModule],
  exports: [DepartmentsService],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, WorkspacesService, BlueprintValidationPipe],

})
export class DepartmentsModule { }
