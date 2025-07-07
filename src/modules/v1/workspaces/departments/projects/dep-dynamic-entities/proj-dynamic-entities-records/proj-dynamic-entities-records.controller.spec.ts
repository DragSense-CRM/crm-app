import { Test, TestingModule } from '@nestjs/testing';
import { ProjDynamicEntitiesRecordsController } from './proj-dynamic-entities-records.controller';
import { ProjDynamicEntitiesRecordsService } from './proj-dynamic-entities-records.service';

describe('DynamicEntitiesRecordsController', () => {
  let controller: DynamicEntitiesRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjDynamicEntitiesRecordsController],
      providers: [ProjDynamicEntitiesRecordsService],
    }).compile();

    controller = module.get<ProjDynamicEntitiesRecordsController>(ProjDynamicEntitiesRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
