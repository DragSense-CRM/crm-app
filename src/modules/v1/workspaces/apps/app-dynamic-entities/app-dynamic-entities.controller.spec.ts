import { Test, TestingModule } from '@nestjs/testing';
import { DepDynamicEntitiesController } from './app-dynamic-entities.controller';
import { DepDynamicEntitiesService } from './app-dynamic-entities.service';

describe('DepDynamicEntitiesController', () => {
  let controller: DepDynamicEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepDynamicEntitiesController],
      providers: [DepDynamicEntitiesService],
    }).compile();

    controller = module.get<DepDynamicEntitiesController>(DepDynamicEntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
