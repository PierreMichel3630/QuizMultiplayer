import { NotificationType } from "./enum/NotificationType";

export interface Notification {
  id: number;
  type: NotificationType;
  data: unknown;
  isread: boolean;
  created_at: Date;
}
