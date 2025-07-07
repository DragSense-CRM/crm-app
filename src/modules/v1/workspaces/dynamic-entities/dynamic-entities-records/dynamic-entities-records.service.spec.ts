import { Test, TestingModule } from '@nestjs/testing';
import { DynamicEntitiesRecordsService } from './dynamic-entities-records.service';

describe('DynamicEntitiesRecordsService', () => {
  let service: DynamicEntitiesRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicEntitiesRecordsService],
    }).compile();

    service = module.get<DynamicEntitiesRecordsService>(DynamicEntitiesRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
