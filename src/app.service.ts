import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { responseSI } from './interfaces/service.interface';
import { Letter } from '@prisma/client';

@Injectable()
export class AppService {

  constructor(
    private readonly prisma: PrismaService,
  ){}

  async VerifyToken(payload: any): Promise<responseSI<void>> {

      try {

            const token = payload.token as string;
            // const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
            console.log(new Date())
            const cutoff = new Date(Date.now() - 4 * 60 * 1000);

            const updatedData = await this.prisma.letter.updateMany({
              where: {
                hashedUuid: token,
                createdAt: { gte: cutoff },
              },
              data: { isVerified: true },
            });

            if(updatedData.count === 0){
              throw new Error('Token Expired');
            }

            console.log('Updated Data:', updatedData);

            return {
              success: true,
              message: 'Email Verified Successfully',
            }

          
      } catch (error: any) {

          if (error.message === 'Token Expired') {
            throw error;
          }

          console.error('Error verifying token:', error.message);
          throw new Error('Something went wrong in service layer');

      }

    }
}
