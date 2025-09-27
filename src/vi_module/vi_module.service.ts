import { Injectable, ParseDatePipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { createHash } from 'node:crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { responseSI } from '../interfaces/service.interface';
import { Letter } from '@prisma/client';
import { createPayload } from './interface/payload.interface';


@Injectable()
export class ViModuleService{

    constructor(
        @InjectQueue('send-bulk-email') private readonly emailQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async create(payload: createPayload) : Promise<responseSI<Letter>>{

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

                await this.emailQueue.add('verification-email', {
                    to: payload.email,
                    url: url,
                    idUuid: letterPayload.idUuid
                }, {
                    delay: 5000,  // Delay for 5 seconds
                    attempts: 3,  // Retry 3 times on failure
                    backoff: { type: 'exponential', delay: 2000 },  // Exponential backoff with 2-second delay
                    removeOnComplete: true, 
                })

                return {
                    success: true,
                    message: 'Letter created and verification email queued',
                    data: letterPayload
                }

            }

            if(!findExistingEmail.isVerified){

                const jwtToken = this.jwtService.sign({ email: payload.email });

                const token = createHash('sha256').update(jwtToken).digest('hex');
                
                const url = `${this.configService.get<string>('DEV_URL')}/email-verify?token=${token}`;


                await this.prisma.letter.update({
                    where: {
                        idUuid: findExistingEmail.idUuid
                    },
                    data: {
                        hashedUuid: token,
                        email: payload.email,
                        content: {
                            create: {
                                content: payload.content,
                                sendDate: payload.sendDate
                            }
                        }
                    }
                })

                await this.emailQueue.add('verification-email', {
                    to: payload.email,
                    url: url,
                    idUuid: findExistingEmail.idUuid
                }, {
                    delay: 5000,  // Delay for 5 seconds
                    attempts: 3,  // Retry 3 times on failure
                    backoff: { type: 'exponential', delay: 2000 },  // Exponential backoff with 2-second delay
                    removeOnComplete: true, 
                })

                
                return {
                    success: true,
                    message: 'Letter content added and verification email re-queued',
                    data: findExistingEmail
                }

            }

            await this.prisma.content.create({
                data: {
                    content: payload.content,
                    sendDate: payload.sendDate,
                    letterId: findExistingEmail.idUuid
                }
            });

            // return "created";
            return {
                success: true,
                message: 'Letter content added',
                data: findExistingEmail
            }

        } catch (error: any){

            console.error(error);
            if(error.clientVersion){
                throw new Error('sendDate is out of range');
            }

            return {
                success: false, 
                message: 'Error creating letter',
                error: {
                    message: error.message,
                    details: error.meta
                }
            }

        }
    }

}