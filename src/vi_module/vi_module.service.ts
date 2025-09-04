import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { createHash } from 'node:crypto';


@Injectable()
export class ViModuleService{

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly emailService: MailerService,
        private readonly configService: ConfigService
    ) {}

    async create(payload: any) {

        try {

            const findExistingEmail = await this.prisma.letter.findUnique({
                where: {
                    email: payload.email
                }
            });

            if(!findExistingEmail){
                
                const jwtToken = this.jwtService.sign({ email: payload.email });

                const token = createHash('sha256').update(jwtToken).digest('hex');


                const letterPayload = await this.prisma.letter.create({
                    data: {
                        hashedUuid: token,
                        email: payload.email,
                        content: {
                            create: { 
                                content: payload.content,
                                sendDate: payload.sendDate
                            }
                        },
                    }
                });

                console.log(letterPayload);

                const url = `${this.configService.get<string>('DEV_URL')}/email-verify?token=${token}`;

                await this.emailService.sendMail({
                    to: payload.email,
                    subject: 'Verify your letter',
                    template: './verify',
                    text: `Please verify your letter by clicking on the link below: ${url}`,
                }); 

                return url;

            }

            if(!findExistingEmail.isVerified){

                const url = `${this.configService.get<string>('DEV_URL')}/email-verify?token=${findExistingEmail.hashedUuid}`;

                await this.prisma.content.create({
                    data: {
                        content: payload.content,
                        sendDate: payload.sendDate,
                        letterId: findExistingEmail.idUuid
                    }
                });

                await this.emailService.sendMail({
                    to: payload.email,
                    subject: 'Verify your letter',
                    template: './verify',
                    text: `Please verify your letter by clicking on the link below: ${url}`,
                }); 

                return url;

            }

            await this.prisma.content.create({
                data: {
                    content: payload.content,
                    sendDate: payload.sendDate,
                    letterId: findExistingEmail.idUuid
                }
            });

            return "created";

        } catch (error: any) {

            if(error.code === 'P2002'){
                // console.log(letterPayload)
                return "duplicate";
            }

            console.error('Error creating letter:', error.message);
            return "false";

        }
    }

}