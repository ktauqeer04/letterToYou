import { Transform, Type } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateLetterDto {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @Transform(({ value }) => {

        if (typeof value === 'boolean') {
            throw new Error('sendDate must be a valid date');
        }
        
        if (typeof value === 'string') {
            return new Date(value);
        }
        return value;
    })
    @Type(() => Date)
    @IsDate({ message: 'sendDate must be a valid date' })
    @IsNotEmpty()
    sendDate: Date;
    
}