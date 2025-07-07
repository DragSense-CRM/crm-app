import { Test, TestingModule } from '@nestjs/testing';
import { DepDynamicEntitiesRecordsService } from './dep-dynamic-entities-records.service';

describe('DepDynamicEntitiesRecordsService', () => {
  let service: DepDynamicEntitiesRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepDynamicEntitiesRecordsService],
    }).compile();

    service = module.get<DepDynamicEntitiesRecordsService>(DepDynamicEntitiesRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
