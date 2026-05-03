import { Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChallenge } from "src/context/ChallengeProvider";
import {
  ChallengeDateEnum,
  ChallengeTypeResultEnum,
} from "src/models/enum/ChallengeEnum";
import { Profile } from "src/models/Profile";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import crownalltime from "src/assets/crown/crownalltime.png";
import crownday from "src/assets/crown/crownday.png";
import crownmonth from "src/assets/crown/crownmonth.png";
import crownweek from "src/assets/crown/crownweek.png";
import poop from "src/assets/crown/poop.png";
import {
  ResultChallengeDay,
  ResultChallengeMonth,
  ResultChallengeWeek,
} from "./ChallengeBlock";
import { ChallengeProfilDialog } from "./ChallengeProfilDialog";

export const WinnerChallengeBlock = () => {
  const { t } = useTranslation();

  const { winDay, winWeek, winMonth } = useChallenge();

  const [profile, setProfile] = useState<
    Profile | undefined
  >(undefined);

  const getDate = (format: string, dateString?: string | Date) => {
    let result = "";
    if (dateString) {
      if (format === "day") {
        result = moment(dateString).format("DD/MM/YYYY");
      } else if (format === "month") {
        result = moment(dateString, "MM/YYYY").format("MMMM YYYY");
      } else if (format === "week") {
        const date = moment(dateString, "WW/YYYY");
        const start = date.clone().weekday(1);
        const end = date.clone().weekday(7);
        result = `${start.format("DD")} - ${end.format("DD MMM YYYY")}`;
      }
    }
    return result;
  };

  return (
    <Grid container spacing={1}>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        size={12}
      >
        <Typography variant="h4">{t("commun.titleholder")}</Typography>
      </Grid>
      <ResultChallengeBlock
        profile={winDay?.profile}
        label={t("commun.day")}
        date={getDate("day", winDay?.challenge.date)}
        extra={<ResultChallengeDay value={winDay} />}
        onSelect={() => setProfile(winDay?.profile) }
      />
      <ResultChallengeBlock
        profile={winWeek?.profile}
        label={t("commun.week")}
        date={getDate("week", winWeek?.week)}
        extra={<ResultChallengeWeek value={winWeek} />}
        onSelect={() => setProfile(winWeek?.profile) }
      />
      <ResultChallengeBlock
        profile={winMonth?.profile}
        label={t("commun.month")}
        date={getDate("month", winMonth?.month)}
        extra={<ResultChallengeMonth value={winMonth} />}
        onSelect={() => setProfile(winMonth?.profile) }
      />
      <ChallengeProfilDialog
        profileId={profile?.id}
        close={() => setProfile(undefined)}
        open={profile !== undefined}
      />
    </Grid>
  );
};

interface PropsWinnerBlock {
  profile?: Profile;
  label: string;
  date: string;
  image?: string;
  extra?: JSX.Element;
  onSelect: () => void;
}

const ResultChallengeBlock = ({
  profile,
  label,
  date,
  image,
  extra,
  onSelect,
}: PropsWinnerBlock) => {
  return (
    <Grid size={4} sx={{ cursor: "pointer" }} onClick={onSelect}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Typography variant="h4">{label}</Typography>
        <Typography variant="caption">{date}</Typography>
        {image && <img src={image} width={50} alt="crown" />}
        {profile && (
          <>
            <AvatarAccountBadge profile={profile} size={60} />
            <Typography
              variant="h6"
              sx={{
                overflow: "hidden",
                display: "block",
                lineClamp: 1,
                boxOrient: "vertical",
                textOverflow: "ellipsis",
                maxWidth: percent(100),
                whiteSpace: "nowrap",
              }}
            >
              {profile?.username}
            </Typography>
          </>
        )}
        {extra}
      </Box>
    </Grid>
  );
};

interface PropsWinnerTextBlock {
  type: ChallengeTypeResultEnum;
  date: ChallengeDateEnum;
  profile?: Profile | null;
}
export const ResultTextBlock = ({
  date,
  profile,
  type,
}: PropsWinnerTextBlock) => {
  const { t } = useTranslation();

  const image = useMemo(() => {
    let result = poop;
    if (type === ChallengeTypeResultEnum.winner) {
      switch (date) {
        case ChallengeDateEnum.day:
          result = crownday;
          break;
        case ChallengeDateEnum.week:
          result = crownweek;
          break;
        case ChallengeDateEnum.month:
          result = crownmonth;
          break;
        case ChallengeDateEnum.alltime:
          result = crownalltime;
          break;
      }
    }
    return result;
  }, [date, type]);

  const label = useMemo(() => {
    let result = t(`challenge.${type}.alltime`);
    if (date === ChallengeDateEnum.day) {
      const date = moment().subtract(1, "day").format("DD/MM/YYYY");
      result = t(`challenge.${type}.day`, { value: date });
    } else if (date === ChallengeDateEnum.week) {
      const date = moment().subtract(1, "weeks").format("WW");
      result = t(`challenge.${type}.week`, { value: date });
    } else if (date === ChallengeDateEnum.month) {
      const date = moment().subtract(1, "month").format("MMMM");
      result = t(`challenge.${type}.month`, { value: date });
    }
    return result;
  }, [type, date, t]);

  return (
    profile && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: px(4),
        }}
      >
        <img src={image} width={20} alt="crown" />
        <Typography variant="caption">{label}</Typography>
      </Box>
    )
  );
};
