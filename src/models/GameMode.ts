export interface GameMode {
  id: number;
  image: string;
  color: string;
  name: string;
  order: number;
  onClick: () => void;
}
