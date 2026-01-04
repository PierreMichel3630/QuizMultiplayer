import { NotificationType } from "./enum/NotificationType";

export interface Notification {
  id: number;
  profile: string;
  type: NotificationType;
  data: unknown;
  isread: boolean;
  created_at: Date;
}

export interface NotificationInsert {
  profile: string;
  type: NotificationType;
  data: unknown;
}
