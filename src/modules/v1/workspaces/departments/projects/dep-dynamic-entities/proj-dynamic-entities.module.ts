import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjDynamicEntitiesService } from './dynamic-entities.service';
import { ProjDynamicEntitiesController } from './dynamic-entities.controller';

import { BlueprintBaseEntity } from '../blueprints/entities/base-blueprint.entity';
import { Workspace } from '../entities/workspace.entity';
import { DynamicEntitiesRecordsModule } from './dynamic-entities-records/dynamic-entities-records.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlueprintBaseEntity, Workspace]), DynamicEntitiesRecordsModule],
  controllers: [ProjDynamicEntitiesController],
  providers: [ProjDynamicEntitiesService],
})
export class DynamicEntitiesModule {}
