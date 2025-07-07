import { Test, TestingModule } from '@nestjs/testing';
import { DynamicEntitiesController } from './dynamic-entities.controller';
import { DynamicEntitiesService } from './dynamic-entities.service';

describe('DynamicEntitiesController', () => {
  let controller: DynamicEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicEntitiesController],
      providers: [DynamicEntitiesService],
    }).compile();

    controller = module.get<DynamicEntitiesController>(DynamicEntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
