import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Get(':token')
    async VerifyToken(
        @Param('token') token: string,
        @Res() res: any
    ){
        const response = await this.viModuleService.VerifyToken({ token });
        return res.status(HttpStatus.OK).json({
            message: 'Token verification',
            data: response
        }); 
    }
}
