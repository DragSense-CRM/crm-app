import { Test, TestingModule } from '@nestjs/testing';
import { DepResourcesService } from './dep-resources.service';

describe('DepResourcesService', () => {
  let service: DepResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepResourcesService],
    }).compile();

    service = module.get<DepResourcesService>(DepResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
