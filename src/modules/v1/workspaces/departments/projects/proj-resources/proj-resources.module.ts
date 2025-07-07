import { Module } from '@nestjs/common';
import { ProjResourcesService } from './proj-resources.service';
import { ProjResourcesController } from './proj-resources.controller';

@Module({
  controllers: [ProjResourcesController],
  providers: [ProjResourcesService],
})
export class ProjResourcesModule {}
