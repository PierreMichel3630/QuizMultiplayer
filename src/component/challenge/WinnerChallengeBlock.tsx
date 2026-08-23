import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useChallenge } from "src/context/ChallengeProvider";
import { Profile } from "src/models/Profile";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import { useNavigate } from "react-router-dom";
import {
  ResultChallengeDay,
  ResultChallengeMonth,
  ResultChallengeWeek,
} from "./ChallengeBlock";

export const WinnerChallengeBlock = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { winDay, winWeek, winMonth } = useChallenge();

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
        date={moment().subtract(1, "day").format("DD/MM/YYYY")}
        extra={<ResultChallengeDay value={winDay} />}
        onSelect={() => navigate(`/profile/${winDay?.profile.id}/challenge`)}
      />
      <ResultChallengeBlock
        profile={winWeek?.profile}
        label={t("commun.week")}
        date={getDate("week", winWeek?.week)}
        extra={<ResultChallengeWeek value={winWeek} />}
        onSelect={() => navigate(`/profile/${winWeek?.profile.id}/challenge`)}
      />
      <ResultChallengeBlock
        profile={winMonth?.profile}
        label={t("commun.month")}
        date={getDate("month", winMonth?.month)}
        extra={<ResultChallengeMonth value={winMonth} />}
        onSelect={() => navigate(`/profile/${winMonth?.profile.id}/challenge`)}
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
