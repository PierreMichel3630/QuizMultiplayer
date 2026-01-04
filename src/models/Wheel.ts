import { TypeWheelEnum } from "./enum/TypeWheelEnum";

export interface WheelResult {
  money: {
    previous: number;
    actual: number;
  };
  xp: {
    previous: number;
    actual: number;
  };
  option: WheelOption;
}

export interface WheelOption {
  value: string;
  color: string;
  text: string;
  type: TypeWheelEnum;
}
