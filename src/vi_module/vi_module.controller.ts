import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ViModuleService } from './vi_module.service';
import { CreateLetterDto } from './dto/vi_module.dto';
import { responseCI } from '../interfaces/controller.interface';
import { responseSI } from 'src/interfaces/service.interface';

@Controller('vi-module')
export class ViModuleController {
    constructor(private readonly viModuleService: ViModuleService) {}

    @Post()
    async create(
        @Body() letterDto: CreateLetterDto,
        @Res() res: any 
    ): Promise<responseCI<any>> {
        try {
            const response = await this.viModuleService.create(letterDto);

            if (!response.success) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: response.message,
                    error: response.error,
                });
            }

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: response.message,
                data: response.data,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal server error',
                error: { message: error },
            });
        }
    }
}
