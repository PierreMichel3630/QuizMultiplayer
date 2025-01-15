import { ShopType } from "./enum/ShopType";
import { JsonLanguage } from "./Language";

export interface ShopItem {
  id: number;
  type: ShopType;
  name: JsonLanguage;
  icon: string;
  price: number;
  isaccomplishment: boolean;
  theme: number;
}
