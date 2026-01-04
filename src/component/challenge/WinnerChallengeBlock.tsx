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
import { GroupButtonResultChallenge } from "../button/ButtonGroup";

import { Link } from "react-router-dom";
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

export const WinnerChallengeBlock = () => {
  const { t } = useTranslation();

  const { winDay, winWeek, winMonth, allTimeDay, allTimeWeek, allTimeMonth } =
    useChallenge();

  const [select, setSelect] = useState(ChallengeTypeResultEnum.winner);

  const isWin = useMemo(
    () => select === ChallengeTypeResultEnum.winner,
    [select]
  );

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
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{t("commun.titleholder")}</Typography>
        <GroupButtonResultChallenge selected={select} onChange={setSelect} />
      </Grid>
      <ResultChallengeBlock
        profile={isWin ? winDay?.profile : allTimeDay?.profile}
        label={t("commun.day")}
        date={getDate(
          "day",
          isWin ? winDay?.challenge.date : allTimeDay?.challenge.date
        )}
        extra={<ResultChallengeDay value={isWin ? winDay : allTimeDay} />}
      />
      <ResultChallengeBlock
        profile={isWin ? winWeek?.profile : allTimeWeek?.profile}
        label={t("commun.week")}
        date={getDate("week", isWin ? winWeek?.week : allTimeWeek?.week)}
        extra={<ResultChallengeWeek value={isWin ? winWeek : allTimeWeek} />}
      />
      <ResultChallengeBlock
        profile={isWin ? winMonth?.profile : allTimeMonth?.profile}
        label={t("commun.month")}
        date={getDate("month", isWin ? winMonth?.month : allTimeMonth?.month)}
        extra={<ResultChallengeMonth value={isWin ? winMonth : allTimeMonth} />}
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
}

const ResultChallengeBlock = ({
  profile,
  label,
  date,
  image,
  extra,
}: PropsWinnerBlock) => {
  return (
    <Grid item xs={4}>
      <Link
        to={`/challenge/profil/${profile?.id}`}
        style={{
          textDecoration: "inherit",
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
      </Link>
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
