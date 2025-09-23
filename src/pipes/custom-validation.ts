import { ArgumentsHost, BadRequestException, Catch, HttpStatus, ExceptionFilter  } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {

    catch(exception: BadRequestException, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exceptionResponse = exception.getResponse() as any;

        // if(exceptionResponse.message && Array.isArray(exceptionResponse.message)){
        //     const firstErrorMessage = exceptionResponse.message[0];

        //     let customMessage = 'Validation Failed';

        //     if(firstErrorMessage.includes('email must be an email')){
        //         customMessage = 'Email is not Valid';
        //     }else if(firstErrorMessage.includes('empty')){
        //         if(firstErrorMessage.includes('email')){
        //             customMessage = 'Email cannot be Empty'
        //         }

        //     }else if(firstErrorMessage.includes('string')){
        //         customMessage = 'Email must be a string'
        //     }



        //     return response.status(HttpStatus.BAD_REQUEST).json({
        //         success: false,
        //         message: customMessage,
        //         error: {
        //             message: firstErrorMessage
        //         }
        //     });
        // }

        response.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid inputs',
            error: {
                message: exceptionResponse.message[0]
            }
        });
    
    }

}