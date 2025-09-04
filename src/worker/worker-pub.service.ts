import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class WorkerService {
    constructor(
        @InjectQueue('send-bulk-email') private readonly emailQueue: Queue,
        private readonly prisma: PrismaService
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async processTask(){

        console.log('Cron job running every 10 seconds');
        
        const verifiedLetters = await this.prisma.content.findMany({
            where: {
                status: 'PENDING',
                sendDate: { lte: new Date() },
                letter: {
                    isVerified: true
                }
            },
            include: {
                letter: true
            }
        });

        console.log(verifiedLetters);
        

        
        // for(const letter of verifiedLetters){
        //     await this.emailQueue.add('sendEmail', letter, {
        //         delay: 5000,  // Delay for 5 seconds
        //         attempts: 3,  // Retry 3 times on failure
        //         backoff: { type: 'exponential', delay: 2000 },  // Exponential backoff with 2-second delay
        //         removeOnComplete: true,  // Remove after completion
        //     });
        // }

    }

}
