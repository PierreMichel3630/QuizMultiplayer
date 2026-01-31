import { Language } from "./Language";

export interface Translation {
  id: number;
  name: string;
  language: number | Language;
}
