import { Module } from '@nestjs/common';
import { DepResourcesService } from './dep-resources.service';
import { DepResourcesController } from './dep-resources.controller';

@Module({
  controllers: [DepResourcesController],
  providers: [DepResourcesService],
})
export class DepResourcesModule {}
