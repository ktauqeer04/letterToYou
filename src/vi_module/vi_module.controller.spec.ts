import { Test, TestingModule } from '@nestjs/testing';
import { ViModuleController } from './vi_module.controller';

describe('ViModuleController', () => {
  let controller: ViModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViModuleController],
    }).compile();

    controller = module.get<ViModuleController>(ViModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
