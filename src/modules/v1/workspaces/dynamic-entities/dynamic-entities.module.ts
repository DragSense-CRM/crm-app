import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DynamicEntitiesService } from './dynamic-entities.service';
import { DynamicEntitiesController } from './dynamic-entities.controller';

import { BlueprintBaseEntity } from '../blueprints/entities/base-blueprint.entity';
import { Workspace } from '../entities/workspace.entity';
import { DynamicEntitiesRecordsModule } from './dynamic-entities-records/dynamic-entities-records.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlueprintBaseEntity, Workspace]), DynamicEntitiesRecordsModule],
  controllers: [DynamicEntitiesController],
  providers: [DynamicEntitiesService],
})
export class DynamicEntitiesModule {}
