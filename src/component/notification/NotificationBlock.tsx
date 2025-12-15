import { Notification } from "src/models/Notification";
import { FriendNotificationBlock } from "./FriendNotificationBlock";
import { DuelNotificationBlock } from "./DuelNotificationBlock";

interface Props {
  notification: Notification;
  onDelete: (notification: Notification) => void;
}

export const NotificationBlock = ({ notification, onDelete }: Props) => {
  return (
    <>
      {
        {
          friend_request: (
            <FriendNotificationBlock
              notification={notification}
              onDelete={onDelete}
            />
          ),
          duel_request: (
            <DuelNotificationBlock
              notification={notification}
              onDelete={onDelete}
            />
          ),
          battle_request: (
            <DuelNotificationBlock
              notification={notification}
              onDelete={onDelete}
            />
          ),
        }[notification.type]
      }
    </>
  );
};
