import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(
    private readonly prisma: PrismaService,
  ){}

  async VerifyToken(payload: any): Promise<Boolean> {

      try {

          const token = payload.token;


          await this.prisma.$transaction(async (tx) => {
            const currentDate = Date.now();
            
            const existingLetter = await tx.letter.findUnique({
              where: { hashedUuid: token },
            });

            if(currentDate - existingLetter.createdAt )

            if (!existingLetter) {

            }

          })
          const twentyFourHoursAgo = new Date();
          twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);


          const letter = await this.prisma.letter.update({
            where: { 
              hashedUuid: token,

            },
            data: { isVerified: true },
          })

          // const decoded = await this.jwtService.verify(token);

          // if(decoded){
          //     await this.prisma.letter.update({
          //         where: {
          //             idUuid: decoded.idUuid
          //         },
          //         data: {
          //             isVerified: true
          //         }
          //     });
          //     return true;
          // }

          return false;
          
      } catch (error: any) {
          console.error('Error verifying token:', error.message);
          return false;
      }

    }
}
