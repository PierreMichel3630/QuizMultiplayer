import { ThemeShop } from "./Theme";

export interface Avatar {
  id: number;
  icon: string;
  price: number;
  isaccomplishment: boolean;
  theme: ThemeShop | null;
}

export interface AvatarUpdate {
  id: number;
  icon?: string | null;
  price?: number;
  isaccomplishment?: boolean;
  theme?: number | null;
}

export interface AvatarInsert {
  icon: string | null;
  price: number;
  isaccomplishment: boolean;
  theme: number | null;
}

export interface AvatarProfile {
  id: number;
  profile: string;
  avatar: Avatar;
}
