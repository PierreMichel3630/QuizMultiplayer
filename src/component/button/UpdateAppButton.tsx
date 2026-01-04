import { useTranslation } from "react-i18next";
import { ButtonColor } from "../Button";
import { Colors } from "src/style/Colors";
import DownloadIcon from "@mui/icons-material/Download";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useNotification } from "src/context/NotificationProvider";
import { deleteNotificationsById } from "src/api/notification";

interface Props {
  onUpdate?: () => void;
}
export const UpdateAppButton = ({ onUpdate }: Props) => {
  const { t } = useTranslation();
  const { updateServiceWorker } = useRegisterSW();
  const { notificationUpdate, getNotifications } = useNotification();

  const updateApp = () => {
    updateServiceWorker();
    if (notificationUpdate && notificationUpdate.id !== 0) {
      deleteNotificationsById(notificationUpdate.id).then(() => {
        getNotifications();
      });
    }
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <ButtonColor
      typography="h6"
      iconSize={20}
      value={Colors.green}
      label={t("commun.installupdate")}
      icon={DownloadIcon}
      variant="contained"
      onClick={updateApp}
    />
  );
};
