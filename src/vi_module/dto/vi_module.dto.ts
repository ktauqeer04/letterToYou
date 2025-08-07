import { Type } from "class-transformer";
import { IsDate, IsEmail, IsString } from "class-validator";

export class CreateLetterDto {

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    content: string;

    @Type(() => Date)
    @IsDate()
    sendDate: Date;
    
}