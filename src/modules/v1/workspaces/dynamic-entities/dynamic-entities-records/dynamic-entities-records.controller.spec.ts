import { Test, TestingModule } from '@nestjs/testing';
import { DynamicEntitiesRecordsController } from './dynamic-entities-records.controller';
import { DynamicEntitiesRecordsService } from './dynamic-entities-records.service';

describe('DynamicEntitiesRecordsController', () => {
  let controller: DynamicEntitiesRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicEntitiesRecordsController],
      providers: [DynamicEntitiesRecordsService],
    }).compile();

    controller = module.get<DynamicEntitiesRecordsController>(DynamicEntitiesRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
