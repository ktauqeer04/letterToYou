import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ViModuleService } from './vi_module/vi_module.service';
import { ViModuleModule } from './vi_module/vi_module.module';
import { JwtModule } from '@nestjs/jwt';
import { WorkerModule } from './worker/worker.module';
import { BullModule } from '@nestjs/bullmq';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    ViModuleModule, 
    JwtModule,
    WorkerModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService, ViModuleService],
})
export class AppModule {}
  