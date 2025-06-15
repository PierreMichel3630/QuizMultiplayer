import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Box, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ClassementChallengeEnum,
  ClassementChallengeGlobalTimeEnum,
  ClassementChallengeTimeEnum,
  ClassementEnum,
  ClassementScoreEnum,
  ClassementSoloModeEnum,
  ClassementSoloTimeEnum,
} from "src/models/enum/ClassementEnum";
import { AllGameModeEnum, GameModeEnum } from "src/models/enum/GameEnum";
import { Colors } from "src/style/Colors";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { ChallengeTypeResultEnum } from "src/models/enum/ChallengeEnum";
import { useUser } from "src/context/UserProvider";

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
          const color = option.color ? option.color : Colors.colorApp;
          return (
            <Box
              key={index}
              sx={{
                borderRadius: px(50),
                p: padding(2, 8),
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
  const { hasChallenge } = useUser();

  const options = useMemo(() => {
    const values = [
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
    ];
    return hasChallenge
      ? [
          {
            icon: <EmojiEventsIcon />,
            label: t("commun.challenge"),
            value: AllGameModeEnum.CHALLENGE,
            color: Colors.green,
          },
          ...values,
        ]
      : [...values];
  }, [t, hasChallenge]);

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
  selected: ClassementSoloTimeEnum;
  onChange: (value: ClassementSoloTimeEnum) => void;
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
        value: ClassementSoloTimeEnum.week,
      },
      {
        label: t("commun.month"),
        value: ClassementSoloTimeEnum.month,
      },
      {
        label: t("commun.alltime"),
        value: ClassementSoloTimeEnum.alltime,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementSoloTimeEnum)}
    />
  );
};

interface PropsGroupButtonChallengeTime {
  selected: ClassementChallengeTimeEnum;
  onChange: (value: ClassementChallengeTimeEnum) => void;
}
export const GroupButtonChallengeTime = ({
  selected,
  onChange,
}: PropsGroupButtonChallengeTime) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("commun.day"),
        value: ClassementChallengeTimeEnum.day,
      },
      {
        label: t("commun.week"),
        value: ClassementChallengeTimeEnum.week,
      },
      {
        label: t("commun.month"),
        value: ClassementChallengeTimeEnum.month,
      },
      {
        label: t("commun.alltime"),
        value: ClassementChallengeTimeEnum.alltime,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementChallengeTimeEnum)}
    />
  );
};

interface PropsGroupButtonChallengeGlobal {
  selected: ClassementChallengeGlobalTimeEnum;
  onChange: (value: ClassementChallengeGlobalTimeEnum) => void;
}
export const GroupButtonChallengeGlobal = ({
  selected,
  onChange,
}: PropsGroupButtonChallengeGlobal) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("commun.day"),
        value: ClassementChallengeGlobalTimeEnum.windaychallenge,
      },
      {
        label: t("commun.week"),
        value: ClassementChallengeGlobalTimeEnum.winweekchallenge,
      },
      {
        label: t("commun.month"),
        value: ClassementChallengeGlobalTimeEnum.winmonthchallenge,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementChallengeGlobalTimeEnum)}
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
      {
        icon: <EmojiEventsIcon />,
        label: t("commun.challenge"),
        value: ClassementEnum.challenge,
        color: Colors.green,
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
        value: ClassementSoloTimeEnum.week,
      },
      {
        label: t("commun.month"),
        value: ClassementSoloTimeEnum.month,
      },
      {
        label: t("commun.alltime"),
        value: ClassementSoloTimeEnum.alltime,
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

interface PropsGroupButtonResultChallenge {
  selected: ChallengeTypeResultEnum;
  onChange: (value: ChallengeTypeResultEnum) => void;
}
export const GroupButtonResultChallenge = ({
  selected,
  onChange,
}: PropsGroupButtonResultChallenge) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("challenge.result.winner"),
        value: ChallengeTypeResultEnum.winner,
        color: Colors.green,
      },
      {
        label: t("challenge.result.loser"),
        value: ChallengeTypeResultEnum.loser,
        color: Colors.red,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ChallengeTypeResultEnum)}
    />
  );
};

interface PropsGroupButtonChallenge {
  selected: ClassementChallengeEnum;
  onChange: (value: ClassementChallengeEnum) => void;
}
export const GroupButtonChallenge = ({
  selected,
  onChange,
}: PropsGroupButtonChallenge) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      {
        label: t("commun.perdate"),
        value: ClassementChallengeEnum.perdate,
        color: Colors.blue,
      },
      {
        label: t("commun.global"),
        value: ClassementChallengeEnum.global,
        color: Colors.red,
      },
    ],
    [t]
  );

  return (
    <GroupButton
      options={options}
      selected={selected}
      onChange={(value) => onChange(value as ClassementChallengeEnum)}
    />
  );
};
