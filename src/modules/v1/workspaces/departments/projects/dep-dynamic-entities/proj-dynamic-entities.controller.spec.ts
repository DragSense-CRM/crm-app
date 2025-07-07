import { Test, TestingModule } from '@nestjs/testing';
import { ProjDynamicEntitiesController } from './proj-dynamic-entities.controller';
import { ProjDynamicEntitiesService } from './proj-dynamic-entities.service';

describe('ProjDynamicEntitiesController', () => {
  let controller: ProjDynamicEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjDynamicEntitiesController],
      providers: [ProjDynamicEntitiesService],
    }).compile();

    controller = module.get<ProjDynamicEntitiesController>(ProjDynamicEntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
