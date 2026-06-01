import { NotificationType } from "src/models/enum/NotificationType";
import { supabase } from "./supabase";
import { NotificationInsert } from "src/models/Notification";

const SUPABASE_NOTIFICATION_TABLE = "notification";

const SUPABASE_SENDNOTIFICATION_FUNCTION = "send-notification";

export const selectNotificationsNotRead = (profile: string) =>
  supabase
    .from(SUPABASE_NOTIFICATION_TABLE)
    .select("*")
    .eq("profile", profile)
    .eq("isread", false)
    .order("created_at", { ascending: true });

export const deleteNotificationsById = (id: number) =>
  supabase.from(SUPABASE_NOTIFICATION_TABLE).delete().eq("id", id);

export const sendNotification = (type: string, data: unknown) =>
  supabase.functions.invoke(SUPABASE_SENDNOTIFICATION_FUNCTION, {
    body: { type_notification: type, data: data },
  });

export const insertNotification = (value: NotificationInsert) =>
  supabase.from(SUPABASE_NOTIFICATION_TABLE).insert(value);

export const selectNotificationsByProfilePaginate = (
  profile: string,
  page: number,
  itemperpage: number,
) => {
  const from = page * itemperpage;
  const to = from + itemperpage - 1;

  return supabase
    .from(SUPABASE_NOTIFICATION_TABLE)
    .select("*")
    .eq("profile", profile)
    .range(from, to)
    .order("created_at", { ascending: false });
};

export const updateReadNotifications = () => {
  const typesNotificationExclude = [
    NotificationType.accomplishment_unlock,
    NotificationType.battle_request,
    NotificationType.duel_request,
    NotificationType.friend_request,
  ];

  return supabase
    .from(SUPABASE_NOTIFICATION_TABLE)
    .update({ isread: true })
    .not("type", "in", `(${typesNotificationExclude.join(",")})`);
};
