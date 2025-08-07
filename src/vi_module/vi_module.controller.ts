import { Body, Controller, Get, Post } from '@nestjs/common';
import { ViModuleService } from './vi_module.service';
import { CreateLetterDto } from './dto/vi_module.dto';


@Controller('vi-module')
export class ViModuleController {

    constructor(private readonly viModuleService: ViModuleService) {}

    
    @Post()
    create(@Body() letterDto: CreateLetterDto): Promise<Boolean>{
        return this.viModuleService.create(letterDto);
        
    }

    @Get()
    findAll(): string {
        return 'This action returns all letters';
    }

}
