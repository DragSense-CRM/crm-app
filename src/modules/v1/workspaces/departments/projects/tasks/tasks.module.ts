import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsService } from '../projects.service';


import { Project } from '../entities/project.entity';
import { Task } from './entities/task.entity';

import { BlueprintsModule } from '../../../blueprints/blueprints.module';
import { BlueprintValidationPipe } from '../../../pipes/blueprint-validation-pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task]), BlueprintsModule],
  controllers: [TasksController],
  providers: [TasksService, ProjectsService, BlueprintValidationPipe],
})
export class TasksModule { }
