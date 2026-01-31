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
}
export const DuelButton = ({ play }: Props) => {
  const { t } = useTranslation();
  const { config } = useRealtime();

  const [openModal, setOpenModal] = useState(false);

  const versionMin = useMemo(
    () => (config ? config.min_version_duel : "2.0.2"),
    [config]
  );

  const playDuel = () => {
    if (config) {
      const isPlayable = isVersionGreaterOrEqual(
        VERSION_APP,
        config.min_version_duel
      );
      if (isPlayable) {
        play();
      } else {
        setOpenModal(true);
      }
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
        versionMin={versionMin}
        versionApp={VERSION_APP}
        open={openModal}
      />
    </>
  );
};

interface Props {
  play: () => void;
}
export const SoloButton = ({ play }: Props) => {
  const { t } = useTranslation();
  const { config } = useRealtime();

  const [openModal, setOpenModal] = useState(false);

  const versionMin = useMemo(
    () => (config ? config.min_version_solo : "2.0.2"),
    [config]
  );

  const playSolo = () => {
    if (config) {
      const isPlayable = isVersionGreaterOrEqual(
        VERSION_APP,
        config.min_version_solo
      );
      if (isPlayable) {
        play();
      } else {
        setOpenModal(true);
      }
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
        versionMin={versionMin}
        versionApp={VERSION_APP}
        open={openModal}
      />
    </>
  );
};

interface Props {
  play: () => void;
}
export const TrainingButton = ({ play }: Props) => {
  const { t } = useTranslation();
  const { config } = useRealtime();

  const [openModal, setOpenModal] = useState(false);

  const versionMin = useMemo(
    () => (config ? config.min_version_solo : "2.0.2"),
    [config]
  );

  const playTraining = () => {
    if (config) {
      const isPlayable = isVersionGreaterOrEqual(
        VERSION_APP,
        config.min_version_training
      );
      if (isPlayable) {
        play();
      } else {
        setOpenModal(true);
      }
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
        versionMin={versionMin}
        versionApp={VERSION_APP}
        open={openModal}
      />
    </>
  );
};
