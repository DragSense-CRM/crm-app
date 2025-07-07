import { Test, TestingModule } from '@nestjs/testing';
import { DepResourcesController } from './dep-resources.controller';
import { DepResourcesService } from './dep-resources.service';

describe('DepResourcesController', () => {
  let controller: DepResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepResourcesController],
      providers: [DepResourcesService],
    }).compile();

    controller = module.get<DepResourcesController>(DepResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
