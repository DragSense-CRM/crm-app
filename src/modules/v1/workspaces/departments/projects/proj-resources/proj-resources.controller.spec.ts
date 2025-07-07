import { Test, TestingModule } from '@nestjs/testing';
import { ProjResourcesController } from './proj-resources.controller';
import { ProjResourcesService } from './proj-resources.service';

describe('ProjResourcesController', () => {
  let controller: ProjResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjResourcesController],
      providers: [ProjResourcesService],
    }).compile();

    controller = module.get<ProjResourcesController>(ProjResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
