import { Test, TestingModule } from '@nestjs/testing';
import { ProjResourcesService } from './proj-resources.service';

describe('ProjResourcesService', () => {
  let service: ProjResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjResourcesService],
    }).compile();

    service = module.get<ProjResourcesService>(ProjResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
