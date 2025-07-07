import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

import { Workspace } from './entities/workspace.entity';

import { ResourcesModule } from './resources/resources.module';
import { BlueprintsModule } from './blueprints/blueprints.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './departments/projects/projects.module';
import { AppsModule } from './apps/apps.module';
import { DynamicEntitiesModule } from './dynamic-entities/dynamic-entities.module';
import { ProjectDynamicEntitiesRecordsModule } from './projects/project-dynamic-entities-records/project-dynamic-entities-records.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), ResourcesModule, BlueprintsModule, DepartmentsModule, ProjectsModule, AppsModule, DynamicEntitiesModule, ProjectDynamicEntitiesRecordsModule],
  exports: [WorkspacesService],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
