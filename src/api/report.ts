import { ReportInsert } from "src/models/Report";
import { supabase } from "./supabase";

export const SUPABASE_REPORT_TABLE = "report";
export const SUPABASE_REPORTMESSAGE_TABLE = "reportmessage";

export const selectReportMessage = () =>
  supabase.from(SUPABASE_REPORTMESSAGE_TABLE).select("*");

export const selectReport = (page: number, itemperpage: number) =>
  supabase
    .from(SUPABASE_REPORT_TABLE)
    .select(
      "*, message(*), question(*), profile(*), sologame(*,themequestion(* ,themetranslation!inner(name, language(*)))), duelgame(*,themequestion(* ,themetranslation!inner(name, language(*))))"
    )
    .order("created_at", { ascending: true })
    .range(page * itemperpage, (page + 1) * itemperpage);

export const countReportMessage = () =>
  supabase
    .from(SUPABASE_REPORT_TABLE)
    .select("*", { count: "exact", head: true });

export const insertReport = (report: ReportInsert) =>
  supabase.from(SUPABASE_REPORT_TABLE).insert(report);

export const deleteReportById = (id: number) =>
  supabase.from(SUPABASE_REPORT_TABLE).delete().eq("id", id);
