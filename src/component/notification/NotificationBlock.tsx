import { deleteNotificationsById } from "src/api/notification";
import { Notification } from "src/models/Notification";
import { BattleNotificationBlock } from "./BattleNotificationBlock";
import { DuelNotificationBlock } from "./DuelNotificationBlock";
import { FriendNotificationBlock } from "./FriendNotificationBlock";
import { OtherNotificationBlock } from "./OtherNotificationBlock";
import { UpdateAppNotificationBlock } from "./UpdateAppNotificationBlock";
import { AccomplishmentNotificationBlock } from "./AccomplishmentNotificationBlock";

interface Props {
  notification: Notification;
  onDelete?: (notification: Notification) => void;
}

export const NotificationBlock = ({ notification, onDelete }: Props) => {
  const onDeleteNotification = async (notification: Notification) => {
    deleteNotificationsById(notification.id).then(() => {
      if (onDelete) onDelete(notification);
    });
  };

  return (
    <>
      {
        {
          friend_request: (
            <FriendNotificationBlock
              notification={notification}
              onDelete={onDeleteNotification}
            />
          ),
          duel_request: (
            <DuelNotificationBlock
              notification={notification}
              onDelete={onDeleteNotification}
            />
          ),
          battle_request: (
            <BattleNotificationBlock
              notification={notification}
              onDelete={onDeleteNotification}
            />
          ),
          update_app: (
            <UpdateAppNotificationBlock notification={notification} />
          ),
          accomplishment_unlock: (
            <AccomplishmentNotificationBlock
              notification={notification}
              onDelete={onDeleteNotification}
            />
          ),
          other: (
            <OtherNotificationBlock
              notification={notification}
              onDelete={onDeleteNotification}
            />
          ),
        }[notification.type]
      }
    </>
  );
};
