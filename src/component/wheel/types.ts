import { TypeWheelEnum } from "src/models/enum/TypeWheelEnum";

interface ImagePropsLocal extends ImageProps {
  _imageHTML?: HTMLImageElement;
}

export interface WheelData {
  image?: ImagePropsLocal;
  value: string;
  color: string;
  type: TypeWheelEnum;
}

export interface ImageProps {
  uri: string;
  offsetX?: number;
  offsetY?: number;
  sizeMultiplier?: number;
  landscape?: boolean;
}
