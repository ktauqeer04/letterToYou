import { responseSI } from "./service.interface"

export interface responseCI<T> extends responseSI<T>{
    status?: number
}

