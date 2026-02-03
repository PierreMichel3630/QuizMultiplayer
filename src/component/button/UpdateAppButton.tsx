import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ButtonLoadingColor } from "../Button";

export const UpdateAppButton = () => {
  const { t } = useTranslation();
  const {
    updateServiceWorker,
    needRefresh: [needRefresh],
  } = useRegisterSW();

  const [loading, setLoading] = useState(false);

  const updateApp = async () => {
    setLoading(true);
    await updateServiceWorker(true);
  };

  return (
    needRefresh && (
      <ButtonLoadingColor
        typography="h6"
        iconSize={20}
        loading={loading}
        loadingIndicator={t("commun.loadinginstallupdate")}
        value={Colors.green}
        label={t("commun.installupdate")}
        icon={DownloadIcon}
        variant="contained"
        onClick={updateApp}
      />
    )
  );
};
