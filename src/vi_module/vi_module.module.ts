import { Module } from '@nestjs/common';
import { ViModuleController } from './vi_module.controller';
import { ViModuleService } from './vi_module.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ViModuleController],
  providers: [ViModuleService]
})
export class ViModuleModule {}
