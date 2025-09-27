import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateLetterDto {

    @IsEmail()
    @IsString({ message: 'email must be a string' })
    @IsNotEmpty({ message: 'email should not be empty'})
    email: string;

    @IsString({ message: 'content must be a string' })
    @IsNotEmpty({ message: 'content should not be empty'})
    content: string;

    @IsDateString({}, { message: 'sendDate is invalid' })
    @IsNotEmpty({ message: 'sendDate should not be empty'})
    sendDate: Date | string;
    
}