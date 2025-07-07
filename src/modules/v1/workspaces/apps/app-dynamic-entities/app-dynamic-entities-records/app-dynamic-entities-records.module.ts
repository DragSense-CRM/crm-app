import { Module } from '@nestjs/common';
import { DepDynamicEntitiesRecordsService } from './app-dynamic-entities-records.service';
import { DepDynamicEntitiesRecordsController } from './app-dynamic-entities-records.controller';

@Module({
  controllers: [DepDynamicEntitiesRecordsService],
  providers: [DepDynamicEntitiesRecordsController],
})
export class DynamicEntitiesRecordsModule {}
