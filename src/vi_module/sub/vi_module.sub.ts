import { MailerService } from "@nestjs-modules/mailer";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "src/prisma/prisma.service";

@Processor('send-bulk-email')
@Injectable()
export class QueueConsumerService extends WorkerHost{

    constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: MailerService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    
    const { to, url, idUuid } = job.data;
    console.log("job data:", job.data);

    // console.log(`Processing job ${job.id} for email: ${email}`);
    
    try {
        
        await this.emailService.sendMail({
            to: to,
            subject: 'Verify your letter',
            template: './verify',
            text: `Please verify your letter by clicking on the link below: ${url}`,
        });

        await this.prisma.letter.update({
            where: { idUuid: idUuid },
            data: { isVerified: true },
        });


    } catch (error) {
        
        // await this.prisma.letter.update({
        //     where: { uuid: uuid },
        //     data: { status: 'FAILED' },
        // });

        console.error(`Failed to send email to ${to}:`, error);

    }

  }


  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`[QueueConsumer] Started job ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`[QueueConsumer] Completed job ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.error(`[QueueConsumer] Failed job ${job.id}:`, job.failedReason);
  }


}