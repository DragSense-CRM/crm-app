import { Test, TestingModule } from '@nestjs/testing';
import { DepDynamicEntitiesService } from './dep-dynamic-entities.service';

describe('DepDynamicEntitiesService', () => {
  let service: DepDynamicEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepDynamicEntitiesService],
    }).compile();

    service = module.get<DepDynamicEntitiesService>(DepDynamicEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
