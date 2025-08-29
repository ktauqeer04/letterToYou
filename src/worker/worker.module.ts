import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueConsumerService } from './queue-consumer.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'send-bulk-email',
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }, 
      defaultJobOptions: {
        priority: 1,            // high priority (1 is high)
        attempts: 3,            // try up to 3 times total
        backoff: { type: 'exponential', delay: 5000 }, // retries: 5s, 10s, 20s...
        removeOnComplete: true, // clear completed jobs automatically
        removeOnFail: true,     // clear failed jobs automatically
      }
    }), 

  ],
  controllers: [WorkerController],
  providers: [WorkerService, ConfigService, PrismaService, QueueConsumerService],
})
export class WorkerModule {}
