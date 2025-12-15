import { supabase } from "./supabase";

export const SUPABASE_NOTIFICATION_TABLE = "notification";

export const SUPABASE_SENDNOTIFICATION_FUNCTION = "send-notification";

export const selectNotificationsNotRead = (profile: string) =>
  supabase
    .from(SUPABASE_NOTIFICATION_TABLE)
    .select("*")
    .eq("profile", profile)
    .eq("isread", false);

export const deleteNotificationsById = (id: number) =>
  supabase.from(SUPABASE_NOTIFICATION_TABLE).delete().eq("id", id);

export const sendNotification = (type: string, data: unknown) =>
  supabase.functions.invoke(SUPABASE_SENDNOTIFICATION_FUNCTION, {
    body: { type_notification: type, data: data },
  });

export const selectNotificationsByProfilePaginate = (
  profile: string,
  page: number,
  itemperpage: number
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_NOTIFICATION_TABLE)
    .select("*")
    .eq("profile", profile)
    .range(from, to);
};
