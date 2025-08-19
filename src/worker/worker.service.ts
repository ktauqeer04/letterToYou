import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WorkerService {
    constructor(

    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    processTask(){
        console.log('running every 30 seconds');
    }


}
