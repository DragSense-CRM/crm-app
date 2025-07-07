import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlueprintsService } from './blueprints.service';
import { BlueprintsController } from './blueprints.controller';

import { Workspace } from '../entities/workspace.entity';
import { WSBlueprint, BlueprintSchema } from './schemas/blueprint.schema';

import { FieldsService } from './fields.service';
import { WorkspacesService } from '../workspaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    MongooseModule.forFeature([{ name: WSBlueprint.name, schema: BlueprintSchema }]),
  ], 
  exports: [BlueprintsService],
  controllers: [BlueprintsController],
  providers: [BlueprintsService, FieldsService, WorkspacesService],
})
export class BlueprintsModule { }
