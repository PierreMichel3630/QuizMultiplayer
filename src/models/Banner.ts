import { ThemeShop } from "./Theme";

export interface Banner {
  id: number;
  src: string;
  price: number;
  isaccomplishment: boolean;
  theme: ThemeShop | null;
}

export interface BannerUpdate {
  id: number;
  src?: string | null;
  price?: number;
  isaccomplishment?: boolean;
  theme?: number | null;
}

export interface BannerInsert {
  src: string | null;
  price: number;
  isaccomplishment: boolean;
  theme: number | null;
}

export interface BannerProfile {
  id: number;
  profile: string;
  banner: Banner;
}
