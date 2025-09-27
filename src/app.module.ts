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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';



@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ]),
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
  providers: [
    AppService, 
    ViModuleService, 
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard  
    }
  ],
})
export class AppModule {}
  