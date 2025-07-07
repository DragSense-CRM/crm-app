import { Module } from '@nestjs/common';
import { DepDynamicEntitiesRecordsService } from './dep-dynamic-entities-records.service';
import { DepDynamicEntitiesRecordsController } from './dep-dynamic-entities-records.controller';

@Module({
  controllers: [DepDynamicEntitiesRecordsService],
  providers: [DepDynamicEntitiesRecordsController],
})
export class DynamicEntitiesRecordsModule {}
