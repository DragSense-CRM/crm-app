import { Test, TestingModule } from '@nestjs/testing';
import { ProjDynamicEntitiesService } from './proj-dynamic-entities.service';

describe('ProjDynamicEntitiesService', () => {
  let service: ProjDynamicEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjDynamicEntitiesService],
    }).compile();

    service = module.get<ProjDynamicEntitiesService>(ProjDynamicEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
