import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ViModuleService } from './vi_module.service';
import { CreateLetterDto } from './dto/vi_module.dto';


@Controller('vi-module')
export class ViModuleController {

    constructor(
        private readonly viModuleService: ViModuleService
    ) {}

    
    @Post()
    async create(
        @Body() letterDto: CreateLetterDto,
        @Res() res: any
    ){
        const response = await this.viModuleService.create(letterDto);
        return res.status(HttpStatus.CREATED).json({
            message: 'Letter created successfully',
            data: response
        });

    }

    // @Get(':token')
    // async VerifyToken(
    //     @Param('token') token: string,
    //     @Res() res: any
    // ){
    //     const response = await this.viModuleService.VerifyToken({ token });
    //     return res.status(HttpStatus.OK).json({
    //         message: 'Token verification',
    //         data: response
    //     }); 
    // }

}
