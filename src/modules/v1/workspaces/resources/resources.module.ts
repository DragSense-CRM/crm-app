import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';

import { Resource } from './entities/resource.entity';
import { Workspace } from '../entities/workspace.entity';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../users/profiles/entities/profile.entity';

import { BlueprintsModule } from '../blueprints/blueprints.module';

import { WorkspacesService } from '../workspaces.service';
import { FilesService } from './files.service';
import { UsersService } from '../../users/users.service';

import { ResourceSubscriber } from './subscribers/resource.subscriber';

import { BlueprintValidationPipe } from '../pipes/blueprint-validation-pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, Profile, Resource]), BlueprintsModule],
  controllers: [ResourcesController],
  providers: [ResourcesService, WorkspacesService, BlueprintValidationPipe, FilesService, ResourceSubscriber, UsersService],
})
export class ResourcesModule { }
