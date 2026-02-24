export interface GameMode {
  id: number;
  image: string | JSX.Element;
  color: string;
  name: string;
  order: number;
  created_at: Date
  onClick: () => void;
}
