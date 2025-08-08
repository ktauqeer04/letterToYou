import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ViModuleService{
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async create(payload: any) {

        try {
            const createLetter = await this.prisma.letter.create({
                data: payload
            });

            const token = this.jwtService.sign({ 
                uuid: createLetter.uuid,
                email: createLetter.email,
             });

             console.log(token);

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
                const letter = await this.prisma.letter.update({
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