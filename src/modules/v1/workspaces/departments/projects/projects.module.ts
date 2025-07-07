import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

import { TasksModule } from './tasks/tasks.module';
import { BlueprintsModule } from '../../blueprints/blueprints.module';

import { Project } from './entities/project.entity';
import { Department } from '../entities/department.entity';
import { App } from '../../apps/entities/app.entity';

import { DepartmentsService } from '../departments.service'
import { AppsService } from '../../apps/apps.service';

;
import { BlueprintValidationPipe } from '../../pipes/blueprint-validation-pipe';

import { ProjResourcesModule } from './proj-resources/proj-resources.module';


@Module({
  imports: [TypeOrmModule.forFeature([Department, Project, App]), BlueprintsModule, TasksModule, ProjResourcesModule],
  exports: [ProjectsService],
  controllers: [ProjectsController],
  providers: [ProjectsService, DepartmentsService, AppsService, BlueprintValidationPipe],

})
export class ProjectsModule { }
