import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ViModuleService } from './vi_module/vi_module.service';
import { ViModuleModule } from './vi_module/vi_module.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, ViModuleModule, JwtModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ViModuleService],
})
export class AppModule {}
  