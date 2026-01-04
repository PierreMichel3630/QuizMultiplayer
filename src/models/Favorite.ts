export interface Favorite {
  id: number;
  profile: string;
  theme: number | null;
  category: number | null;
}

export interface FavoriteInsert {
  theme?: number;
  category?: number;
}
