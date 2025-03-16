import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Box, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ClassementEnum,
  ClassementScoreEnum,
  ClassementSoloModeEnum,
  ClassementTimeEnum,
} from "src/models/enum/ClassementEnum";
import { AllGameModeEnum, GameModeEnum } from "src/models/enum/GameEnum";
import { Colors } from "src/style/Colors";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface Props {
  selected: string;
  options: Array<{
    icon?: JSX.Element;
    label: string;
    value: string;
    color?: string;
  }>;
  onChange: (value: string) => void;
}

export const GroupButton = ({ options, selected, onChange }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          border: `1px solid ${Colors.grey6}`,
          p: padding(3, 3),
          borderRadius: px(50),
        }}
      >
        {options.map((option, index) => {
          const isSelect = option.value === selected;
          const color = option.color ? option.color : Colors.blue3;
          return (
            <Box
              key={index}
              sx={{
                borderRadius: px(50),
                p: padding(2, 12),
                color: isSelect ? Colors.white : "text.primary",
                backgroundColor: isSelect ? color : "initial",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: px(3),
              }}
              onClick={() => onChange(option.value)}
            >
              {option.icon && option.icon}
              <Typography variant="h6">{option.label}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

interface PropsGroupButtonTypeGame {
  selected: ClassementScoreEnum;
  onChange: (value: ClassementScoreEnum) => void;
}
export const GroupButtonTypeGame = ({
  selected,
  onChange,
}: PropsGroupButtonTypeGame) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        icon: <PlayCircleIcon />,
        label: t("commun.solo"),
        value: ClassementScoreEnum.points,
        color: Colors.blue2,
      },
      {
        icon: <OfflineBoltIcon />,
        label: t("commun.duel"),
        value: ClassementScoreEnum.rank,
        color: Colors.red,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementScoreEnum)}
    />
  );
};

interface PropsGroupButtonAllGameMode {
  selected: AllGameModeEnum;
  onChange: (value: AllGameModeEnum) => void;
}
export const GroupButtonAllGameMode = ({
  selected,
  onChange,
}: PropsGroupButtonAllGameMode) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        icon: <EmojiEventsIcon />,
        label: t("commun.challenge"),
        value: AllGameModeEnum.CHALLENGE,
        color: Colors.green,
      },
      {
        icon: <PlayCircleIcon />,
        label: t("commun.solo"),
        value: AllGameModeEnum.SOLO,
        color: Colors.blue2,
      },
      {
        icon: <OfflineBoltIcon />,
        label: t("commun.duel"),
        value: AllGameModeEnum.DUEL,
        color: Colors.red,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as AllGameModeEnum)}
    />
  );
};

interface PropsGroupButtonAllTypeGame {
  selected: GameModeEnum;
  onChange: (value: GameModeEnum) => void;
}
export const GroupButtonAllTypeGame = ({
  selected,
  onChange,
}: PropsGroupButtonAllTypeGame) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("commun.all"),
        value: GameModeEnum.all,
        color: Colors.green,
      },
      {
        icon: <PlayCircleIcon />,
        label: t("commun.solo"),
        value: GameModeEnum.solo,
        color: Colors.blue2,
      },
      {
        icon: <OfflineBoltIcon />,
        label: t("commun.duel"),
        value: GameModeEnum.duel,
        color: Colors.red,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as GameModeEnum)}
    />
  );
};

interface PropsGroupButtonTime {
  selected: ClassementTimeEnum;
  onChange: (value: ClassementTimeEnum) => void;
}
export const GroupButtonTime = ({
  selected,
  onChange,
}: PropsGroupButtonTime) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("commun.week"),
        value: ClassementTimeEnum.week,
      },
      {
        label: t("commun.month"),
        value: ClassementTimeEnum.month,
      },
      {
        label: t("commun.alltime"),
        value: ClassementTimeEnum.alltime,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementTimeEnum)}
    />
  );
};

interface PropsGroupButtonClassement {
  selected: ClassementEnum;
  onChange: (value: ClassementEnum) => void;
}
export const GroupButtonClassement = ({
  selected,
  onChange,
}: PropsGroupButtonClassement) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        icon: <PlayCircleIcon />,
        label: t("commun.solo"),
        value: ClassementEnum.points,
        color: Colors.blue2,
      },
      {
        icon: <OfflineBoltIcon />,
        label: t("commun.duel"),
        value: ClassementEnum.rank,
        color: Colors.red,
      },
      {
        icon: <MilitaryTechIcon />,
        label: t("commun.level"),
        value: ClassementEnum.xp,
        color: Colors.pink,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementEnum)}
    />
  );
};

interface PropsGroupButtonSoloRanking {
  selected: ClassementSoloModeEnum;
  onChange: (value: ClassementSoloModeEnum) => void;
}
export const GroupButtonSoloRanking = ({
  selected,
  onChange,
}: PropsGroupButtonSoloRanking) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("commun.week"),
        value: ClassementTimeEnum.week,
      },
      {
        label: t("commun.month"),
        value: ClassementTimeEnum.month,
      },
      {
        label: t("commun.alltime"),
        value: ClassementTimeEnum.alltime,
      },
      {
        label: t("commun.finishtheme"),
        value: ClassementSoloModeEnum.finishtheme,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementSoloModeEnum)}
    />
  );
};
