export interface Badge {
  id: number;
  icon: string;
  price: number;
  isaccomplishment: boolean;
}

export interface BadgeProfile {
  id: number;
  profile: string;
  badge: Badge;
}
