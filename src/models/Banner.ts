export interface Banner {
  id: number;
  src: string;
  price: number;
  isaccomplishment: boolean;
}

export interface BannerProfile {
  id: number;
  profile: string;
  banner: Banner;
}
