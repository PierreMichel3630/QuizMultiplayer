import DownloadIcon from "@mui/icons-material/Download";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRealtime } from "src/context/NotificationProvider";
import { Colors } from "src/style/Colors";
import { isVersionGreater } from "src/utils/compare";
import { VERSION_APP } from "src/utils/config";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ButtonColor } from "../Button";

interface Props {
  onUpdate?: () => void;
}
export const UpdateAppButton = ({ onUpdate }: Props) => {
  const { t } = useTranslation();
  const { updateServiceWorker } = useRegisterSW();
  const { config } = useRealtime();

  const updateApp = () => {
    updateServiceWorker();
    if (onUpdate) {
      onUpdate();
    }
  };

  const needUpdate = useMemo(() => {
    const result = config
      ? isVersionGreater(config.version_app, VERSION_APP)
      : false;
    return result;
  }, [config]);

  return (
    needUpdate && (
      <ButtonColor
        typography="h6"
        iconSize={20}
        value={Colors.green}
        label={t("commun.installupdate")}
        icon={DownloadIcon}
        variant="contained"
        onClick={updateApp}
      />
    )
  );
};
