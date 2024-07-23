import { ResponseInsert, ResponseUpdate } from "src/models/Response";
import { supabase } from "./supabase";

export const SUPABASE_RESPONSE_TABLE = "response";

export const selectResponseByType = (type: string) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).select().eq("type", type);

export const updateResponse = (value: ResponseUpdate) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).update(value).eq("id", value.id);

export const insertResponse = (value: ResponseInsert) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).insert(value);

export const deleteResponseById = (id: number) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).delete().eq("id", id);
