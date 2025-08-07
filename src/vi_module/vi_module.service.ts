import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ViModuleService{
    constructor(private readonly prisma: PrismaService) {}

    async create(letterDto: any): Promise<Boolean> {

        try {
            const createLetter = await this.prisma.letter.create({
            data: letterDto
        })

            console.log("Letter created with data:", letterDto);
            return createLetter? true : false;
        } catch (error: any) {
            if (error.code === 'P2002') {
                console.error("Email already exists:", letterDto.email);
            } else {
                console.log("Error creating letter:", error);
            }
            return false;
        }
    }



}