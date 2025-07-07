import { Module } from '@nestjs/common';
import { DynamicEntitiesRecordsService } from './dynamic-entities-records.service';
import { DynamicEntitiesRecordsController } from './dynamic-entities-records.controller';

@Module({
  controllers: [DynamicEntitiesRecordsController],
  providers: [DynamicEntitiesRecordsService],
})
export class DynamicEntitiesRecordsModule {}
