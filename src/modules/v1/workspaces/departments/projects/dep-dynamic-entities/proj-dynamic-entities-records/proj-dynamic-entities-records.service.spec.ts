import { Test, TestingModule } from '@nestjs/testing';
import { ProjDynamicEntitiesRecordsService } from './proj-dynamic-entities-records.service';

describe('ProjDynamicEntitiesRecordsService', () => {
  let service: ProjDynamicEntitiesRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjDynamicEntitiesRecordsService],
    }).compile();

    service = module.get<ProjDynamicEntitiesRecordsService>(ProjDynamicEntitiesRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
