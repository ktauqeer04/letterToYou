import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [WorkerController],
  providers: [WorkerService]
})
export class WorkerModule {}
