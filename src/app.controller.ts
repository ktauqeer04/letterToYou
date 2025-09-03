import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get('email-verify')
    async VerifyToken(
        @Query('token') token: string,
        @Res() res: any
    ){

        try {

            const response = await this.appService.VerifyToken({ token });

            return res.status(HttpStatus.OK).json({
                message: 'Token verification',
                data: response
            });

        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Token verification failed',
                error: error,
            });
        }

    }
}
