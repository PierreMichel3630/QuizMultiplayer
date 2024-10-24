export interface Banner {
  id: number;
  icon: string;
  price: number;
  isaccomplishment: boolean;
}

export interface BannerProfile {
  id: number;
  profile: string;
  banner: Banner;
}
