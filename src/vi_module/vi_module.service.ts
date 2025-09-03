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

            const jwtToken = this.jwtService.sign({ email: payload.email });

            const token = createHash('sha256').update(jwtToken).digest('hex');

            payload.hashedUuid = token;

            await this.prisma.letter.create({
                data: payload
            });

            const url = `${this.configService.get<string>('DEV_URL')}/email-verify?token=${token}`;

            await this.emailService.sendMail({
                to: payload.email,
                subject: 'Verify your letter',
                template: './verify',
                text: `Please verify your letter by clicking on the link below: ${url}`,
            }); 

            return url;

        } catch (error: any) {
            console.error('Error creating letter:', error.message);
            return "false";
        }
    }

    // async VerifyToken(payload: any): Promise<Boolean> {

    //     try {

    //         const token = payload.token;
    //         const decoded = await this.jwtService.verify(token);

    //         if(decoded){
    //             await this.prisma.letter.update({
    //                 where: {
    //                     idUuid: decoded.idUuid
    //                 },
    //                 data: {
    //                     isVerified: true
    //                 }
    //             });
    //             return true;
    //         }

    //         return false;
            
    //     } catch (error: any) {
    //         console.error('Error verifying token:', error.message);
    //         return false;
    //     }
    // }
}