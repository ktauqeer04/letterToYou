import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(
    private readonly prisma: PrismaService,
  ){}

  async VerifyToken(payload: any): Promise<{}> {

      try {

            const token = payload.token;
            const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const updated = await this.prisma.letter.updateMany({
              where: {
                hashedUuid: token,
                createdAt: { gte: cutoff },
              },
              data: { isVerified: true },
            });

            if (updated.count === 0) {
              return { flag: false, message: 'Invalid or expired token' };
            }


            return { flag: true, message: 'Token verified successfully' };
          
      } catch (error: any) {
          console.error('Error verifying token:', error.message);
          return false;
      }

    }
}
