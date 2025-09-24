import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateLetterDto {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsDateString({}, { message: 'sendDate must be an ISO 8601 date string' })
    @IsNotEmpty()
    sendDate: Date | string;
    
}