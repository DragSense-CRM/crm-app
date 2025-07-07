import { Test, TestingModule } from '@nestjs/testing';
import { DepDynamicEntitiesRecordsController } from './dep-dynamic-entities-records.controller';
import { DepDynamicEntitiesRecordsService } from './dep-dynamic-entities-records.service';

describe('DynamicEntitiesRecordsController', () => {
  let controller: DynamicEntitiesRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepDynamicEntitiesRecordsController],
      providers: [DepDynamicEntitiesRecordsService],
    }).compile();

    controller = module.get<DepDynamicEntitiesRecordsController>(DepDynamicEntitiesRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
