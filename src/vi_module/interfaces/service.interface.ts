export interface responseSI<T>{
    success: boolean,
    message: string,
    data?: T,
    error?:{
        message: string,
        details?: any
    }
}