export interface Avatar {
  id: number;
  icon: string;
  price: number;
  isaccomplishment: boolean;
}

export interface AvatarProfile {
  id: number;
  profile: string;
  avatar: Avatar;
}
