import { TypeWheelEnum } from "./enum/TypeWheelEnum"


export interface WheelResult {
    money: { 
        previous: number
        actual: number
    },
    xp: { 
        previous: number
        actual: number
    },
    option: {
        value: number,
        type: TypeWheelEnum
    }
}