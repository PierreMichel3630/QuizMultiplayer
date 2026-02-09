import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { isVersionGreaterOrEqual } from "src/utils/compare";
import { VERSION_APP } from "src/utils/config";
import { ButtonColor } from "../Button";
import { VersionModal } from "../modal/VersionModal";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useRealtime } from "src/context/NotificationProvider";

interface Props {
  play: () => void;
  theme: { minversion?: string };
}
export const DuelButton = ({ play, theme }: Props) => {
  const { t } = useTranslation();
  const { config } = useRealtime();

  const [openModal, setOpenModal] = useState(false);

  const isPlayableMode = useMemo(() => {
    const version = config ? config.min_version_duel : "2.0.2";
    let result = true;
    if (config) {
      result = isVersionGreaterOrEqual(VERSION_APP, version);
    }
    return result;
  }, [config]);

  const isPlayableTheme = useMemo(() => {
    let result = true;
    if (theme?.minversion) {
      result = isVersionGreaterOrEqual(VERSION_APP, theme?.minversion);
    }
    return result;
  }, [theme]);

  const playDuel = () => {
    if (isPlayableMode && isPlayableTheme) {
      play();
    } else {
      setOpenModal(true);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <ButtonColor
        size="small"
        value={Colors.red}
        label={t("commun.duel")}
        icon={OfflineBoltIcon}
        onClick={() => playDuel()}
        variant="contained"
      />
      <VersionModal
        close={onClose}
        versionMin={config?.version_app}
        versionApp={VERSION_APP}
        open={openModal}
      />
    </>
  );
};

export const SoloButton = ({ play, theme }: Props) => {
  const { t } = useTranslation();
  const { config } = useRealtime();

  const [openModal, setOpenModal] = useState(false);

  const isPlayableMode = useMemo(() => {
    const version = config ? config.min_version_solo : "2.0.2";
    let result = true;
    if (config) {
      result = isVersionGreaterOrEqual(VERSION_APP, version);
    }
    return result;
  }, [config]);

  const isPlayableTheme = useMemo(() => {
    let result = true;
    if (theme?.minversion) {
      result = isVersionGreaterOrEqual(VERSION_APP, theme?.minversion);
    }
    return result;
  }, [theme]);

  const playSolo = () => {
    if (isPlayableMode && isPlayableTheme) {
      play();
    } else {
      setOpenModal(true);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <ButtonColor
        size="small"
        value={Colors.blue2}
        label={t("commun.playsolo")}
        icon={PlayCircleIcon}
        onClick={() => playSolo()}
        variant="contained"
      />
      <VersionModal
        close={onClose}
        versionMin={config?.version_app}
        versionApp={VERSION_APP}
        open={openModal}
      />
    </>
  );
};

export const TrainingButton = ({ play, theme }: Props) => {
  const { t } = useTranslation();
  const { config } = useRealtime();

  const [openModal, setOpenModal] = useState(false);

  const isPlayableMode = useMemo(() => {
    const version = config ? config.min_version_training : "2.0.2";
    let result = true;
    if (config) {
      result = isVersionGreaterOrEqual(VERSION_APP, version);
    }
    return result;
  }, [config]);

  const isPlayableTheme = useMemo(() => {
    let result = true;
    if (theme?.minversion) {
      result = isVersionGreaterOrEqual(VERSION_APP, theme?.minversion);
    }
    return result;
  }, [theme]);

  const playTraining = () => {
    if (isPlayableMode && isPlayableTheme) {
      play();
    } else {
      setOpenModal(true);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <ButtonColor
        size="small"
        value={Colors.purple}
        label={t("commun.training")}
        icon={FitnessCenterIcon}
        onClick={() => playTraining()}
        variant="contained"
      />
      <VersionModal
        close={onClose}
        versionMin={config?.version_app}
        versionApp={VERSION_APP}
        open={openModal}
      />
    </>
  );
};
