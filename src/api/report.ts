import { ReportInsert } from "src/models/Report";
import { supabase } from "./supabase";

export const SUPABASE_REPORT_TABLE = "report";
export const SUPABASE_REPORTMESSAGE_TABLE = "reportmessage";

export const selectReportMessage = () =>
  supabase.from(SUPABASE_REPORTMESSAGE_TABLE).select().order("id");

export const insertReport = (report: ReportInsert) =>
  supabase.from(SUPABASE_REPORT_TABLE).insert(report);
