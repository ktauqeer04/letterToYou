import { CreateLetterDto } from "../dto/vi_module.dto";

export interface createPayload extends CreateLetterDto {
    email: string;
    content: string;
    sendDate: Date;
}