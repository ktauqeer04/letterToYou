import { MailerService } from "@nestjs-modules/mailer";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "src/prisma/prisma.service";
import { htmlSkeleton } from "./html.skeleton";

@Processor('send-bulk-email')
@Injectable()
export class QueueConsumerService extends WorkerHost{

    constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: MailerService,
  ) {
    super();
  }


  private async processEmailVerification(job: Job): Promise<void> {

    try {
      
      const { to, url } = job.data;
      console.log("job data:", job.data);

      await this.emailService.sendMail({
          to: to,
          subject: 'Verify your letter',
          html: htmlSkeleton(url),
          template: './verify',
          text: `Please verify your letter by clicking on the link below: ${url}`,
      });

    } catch (error) {

      console.error(`Failed to process email verification job ${job.id}:`, error);
      throw new Error(`Failed to process email verification job ${job.id}`);

    }

  }  

  private async futureEmail(job: Job): Promise<void> {

    try {
      
      console.log("job data:", job.data);

      const { email, content, idUuid } = job.data;

      await this.emailService.sendMail({
          to: email,
          subject: 'Letter to You',
          text: content,
      });

      await this.prisma.content.update({
          where: { idUuid: idUuid },
          data: { status: 'SENT' },
      });

    } catch (error) {
      
      console.error(`Failed to process send email job ${job.id}:`, error);
      throw new Error(`Failed to process send email job ${job.id}`);  

    }

  }

  async process(job: Job): Promise<any> {

    try {
      
      console.log(`Processing job ${job.id} of type ${job.name}`);
      switch (job.name) {

        case 'verification-email': 
          await this.processEmailVerification(job); 
          break;

        case 'sendEmail': 
          await this.futureEmail(job); 
          break;
        
      }

    } catch (error) {
      console.error(`Failed to pro  cess job ${job.id}:`, error);
      throw new Error(`Failed to process job ${job.id}`);
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