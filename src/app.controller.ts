import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { responseCI } from './interfaces/controller.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('email-verify')
    async VerifyToken(
        @Query('token') token: string,
        @Res() res: any
    ): Promise<responseCI<any>>{

        try {

            const response = await this.appService.VerifyToken({ token });

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Token verification',
                data: response
            });

        } catch (error: any) {

            console.log(error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Token verification failed',
                error: error.message,
            });

        }

    }
}
