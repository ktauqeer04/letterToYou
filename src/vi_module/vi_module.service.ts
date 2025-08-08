import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

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

            const createLetter = await this.prisma.letter.create({
                data: payload
            });

            const token = this.jwtService.sign({ 
                uuid: createLetter.uuid
             });

            const url = `${this.configService.get<string>('DEV_URL')}/vi-module/${token}`;

            await this.emailService.sendMail({
                to: payload.email,
                subject: 'Verify your letter',
                template: './verify',
                text: `Please verify your letter by clicking on the link below: ${url}`,
            }); 

            return token;
        } catch (error: any) {
            console.error('Error creating letter:', error.message);
            return "false";
        }
    }

    async VerifyToken(payload: any): Promise<Boolean> {

        try {

            const token = payload.token;
            const decoded = this.jwtService.verify(token);

            if(decoded){
                await this.prisma.letter.update({
                    where: {
                        uuid: decoded.uuid
                    },
                    data: {
                        isVerified: true
                    }
                });
                return true;
            }

            return false;
        } catch (error: any) {
            console.error('Error verifying token:', error.message);
            return false;
        }
    }
}