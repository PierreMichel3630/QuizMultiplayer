import {
  ResponseImageInsert,
  ResponseImageUpdate,
  ResponseInsert,
  ResponseUpdate,
} from "src/models/Response";
import { supabase } from "./supabase";

export const SUPABASE_RESPONSE_TABLE = "response";
export const SUPABASE_RESPONSEIMAGE_TABLE = "responseimage";

export const selectResponseByType = (type: string) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).select().eq("type", type);

export const updateResponse = (value: ResponseUpdate) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).update(value).eq("id", value.id);

export const insertResponse = (value: ResponseInsert) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).insert(value);

export const deleteResponseById = (id: number) =>
  supabase.from(SUPABASE_RESPONSE_TABLE).delete().eq("id", id);

export const selectResponseImageByType = (type: string) =>
  supabase.from(SUPABASE_RESPONSEIMAGE_TABLE).select().eq("type", type);

export const updateResponseImage = (value: ResponseImageUpdate) =>
  supabase.from(SUPABASE_RESPONSEIMAGE_TABLE).update(value).eq("id", value.id);

export const insertResponseImage = (value: ResponseImageInsert) =>
  supabase.from(SUPABASE_RESPONSEIMAGE_TABLE).insert(value);

export const deleteResponseImageById = (id: number) =>
  supabase.from(SUPABASE_RESPONSEIMAGE_TABLE).delete().eq("id", id);

export const searchResponseByTypeAndValue = (value: string, type: string) =>
  supabase
    .from(SUPABASE_RESPONSE_TABLE)
    .select()
    .eq("type", type)
    .ilike("searchvaluefr", `%${value}%`);
