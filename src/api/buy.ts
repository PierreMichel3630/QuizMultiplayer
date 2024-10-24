import { supabase } from "./supabase";

export const SUPABASE_BUYITEM_FUNCTION = "buy-item";

export const buyItem = (type: string, id: number) =>
  supabase.functions.invoke(SUPABASE_BUYITEM_FUNCTION, {
    body: { type: type, id: id },
  });
