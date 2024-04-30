export interface Badge {
  id: number;
  icon: string;
}

export interface BadgeProfile {
  id: number;
  profile: string;
  badge: Badge;
}
