import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import {
  ChallengeRankingDate,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";

interface PropsResultChallengeDay {
  value?: ChallengeRankingDate;
}
export const ResultChallengeDay = ({ value }: PropsResultChallengeDay) => {
  return (
    value && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          width: px(60),
        }}
      >
        <Typography variant="h6" noWrap>
          {value.score} / {NUMBER_QUESTIONS_CHALLENGE}
        </Typography>
        <Typography variant="h6" noWrap>
          {(value.time / 1000).toFixed(2)}s
        </Typography>
      </Box>
    )
  );
};

interface PropsResultChallengeWeek {
  value?: ChallengeRankingWeek;
}
export const ResultChallengeWeek = ({ value }: PropsResultChallengeWeek) => {
  const { t } = useTranslation();
  return (
    value && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="h6" noWrap>
            {value.score} {t("commun.pointsabbreviation")} (
            {value.scoreavg.toFixed(1)})
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" noWrap>
            {(value.time / 1000).toFixed(2)}s
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: px(4),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" noWrap>
            {value.games}
          </Typography>
          <Typography variant="body1" noWrap>
            {t("commun.games")}
          </Typography>
        </Box>
      </Box>
    )
  );
};

interface PropsResultChallengeMonth {
  value?: ChallengeRankingMonth;
}
export const ResultChallengeMonth = ({ value }: PropsResultChallengeMonth) => {
  const { t } = useTranslation();
  return (
    value && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography variant="h6" noWrap>
            {value.score} {t("commun.pointsabbreviation")} (
            {value.scoreavg.toFixed(1)})
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" noWrap>
            {(value.time / 1000).toFixed(2)}s
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: px(4),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" noWrap>
            {value.games}
          </Typography>
          <Typography variant="body1" noWrap>
            {t("commun.games")}
          </Typography>
        </Box>
      </Box>
    )
  );
};
