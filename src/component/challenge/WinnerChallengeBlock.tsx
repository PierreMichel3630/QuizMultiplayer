import { Box, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChallengeDateEnum,
  ChallengeTypeResultEnum,
} from "src/models/enum/ChallengeEnum";
import { Profile } from "src/models/Profile";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";
import { GroupButtonResultChallenge } from "../button/ButtonGroup";
import { useChallenge } from "src/context/ChallengeProvider";

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
import { Link } from "react-router-dom";

export const WinnerChallengeBlock = () => {
  const { t } = useTranslation();

  const { winDay, winWeek, winMonth, loseDay, loseWeek, loseMonth } =
    useChallenge();

  const [select, setSelect] = useState(ChallengeTypeResultEnum.winner);

  const isWin = useMemo(
    () => select === ChallengeTypeResultEnum.winner,
    [select]
  );

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
        profile={isWin ? winDay?.profile : loseDay?.profile}
        label={t("commun.day")}
        image={isWin ? crownday : undefined}
        extra={<ResultChallengeDay value={isWin ? winDay : loseDay} />}
      />
      <ResultChallengeBlock
        profile={isWin ? winWeek?.profile : loseWeek?.profile}
        label={t("commun.week")}
        image={isWin ? crownweek : undefined}
        extra={<ResultChallengeWeek value={isWin ? winWeek : loseWeek} />}
      />
      <ResultChallengeBlock
        profile={isWin ? winMonth?.profile : loseMonth?.profile}
        label={t("commun.month")}
        image={isWin ? crownmonth : undefined}
        extra={<ResultChallengeMonth value={isWin ? winMonth : loseMonth} />}
      />
    </Grid>
  );
};

interface PropsWinnerBlock {
  profile?: Profile;
  label: string;
  image?: string;
  extra?: JSX.Element;
}

const ResultChallengeBlock = ({
  profile,
  label,
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
        {image && <img src={image} width={50} alt="crown" />}
        {profile && (
          <>
            <AvatarAccountBadge profile={profile} size={60} />
            <Typography variant="h6">{profile?.username}</Typography>
          </>
        )}
        {extra}
      </Link>
    </Grid>
  );
};

interface PropsWinnerTextRankingBlock {
  profile: Profile;
}
export const WinnerTextRankingBlock = ({
  profile,
}: PropsWinnerTextRankingBlock) => {
  const {
    winDay,
    winWeek,
    winMonth,
    winAllTime,
    loseDay,
    loseWeek,
    loseMonth,
    loseAllTime,
  } = useChallenge();
  const isWinnerDay = useMemo(
    () => profile.id === winDay?.profile.id,
    [profile, winDay]
  );

  const isWinnerWeek = useMemo(
    () => profile.id === winWeek?.profile.id,
    [profile, winWeek]
  );

  const isWinnerMonth = useMemo(
    () => profile.id === winMonth?.profile.id,
    [profile, winMonth]
  );

  const isWinnerAllTime = useMemo(
    () => profile.id === winAllTime?.profile.id,
    [profile, winAllTime]
  );
  const isLoserDay = useMemo(
    () => profile.id === loseDay?.profile.id,
    [profile, loseDay]
  );

  const isLoserWeek = useMemo(
    () => profile.id === loseWeek?.profile.id,
    [profile, loseWeek]
  );

  const isLoserMonth = useMemo(
    () => profile.id === loseMonth?.profile.id,
    [profile, loseMonth]
  );

  const isLoserAllTime = useMemo(
    () => profile.id === loseAllTime?.profile.id,
    [profile, loseAllTime]
  );

  return (
    <>
      {isWinnerAllTime && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.winner}
          date={ChallengeDateEnum.alltime}
          profile={profile}
        />
      )}
      {isWinnerMonth && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.winner}
          date={ChallengeDateEnum.month}
          profile={profile}
        />
      )}
      {isWinnerWeek && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.winner}
          date={ChallengeDateEnum.week}
          profile={profile}
        />
      )}
      {isWinnerDay && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.winner}
          date={ChallengeDateEnum.day}
          profile={profile}
        />
      )}
      {isLoserAllTime && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.loser}
          date={ChallengeDateEnum.alltime}
          profile={profile}
        />
      )}
      {isLoserMonth && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.loser}
          date={ChallengeDateEnum.month}
          profile={profile}
        />
      )}
      {isLoserWeek && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.loser}
          date={ChallengeDateEnum.week}
          profile={profile}
        />
      )}
      {isLoserDay && (
        <ResultTextBlock
          type={ChallengeTypeResultEnum.loser}
          date={ChallengeDateEnum.day}
          profile={profile}
        />
      )}
    </>
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
