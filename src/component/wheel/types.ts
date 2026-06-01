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

interface ImageProps {
  uri: string;
  offsetX?: number;
  offsetY?: number;
  sizeMultiplier?: number;
  landscape?: boolean;
}
