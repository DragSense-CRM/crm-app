import { Module } from '@nestjs/common';
import { ProjDynamicEntitiesRecordsService } from './proj-dynamic-entities-records.service';
import { ProjDynamicEntitiesRecordsController } from './proj-dynamic-entities-records.controller';

@Module({
  controllers: [ProjDynamicEntitiesRecordsService],
  providers: [ProjDynamicEntitiesRecordsController],
})
export class DynamicEntitiesRecordsModule {}
