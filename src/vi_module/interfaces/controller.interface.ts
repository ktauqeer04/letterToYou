export interface responseI <T>{
    success: boolean,
    message: string,
    data: T,
    error?: {
        message: string,
        details?: any
    }
}

