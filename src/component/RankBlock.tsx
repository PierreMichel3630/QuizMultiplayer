import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Score } from "src/models/Score";

interface Props {
  loading: boolean;
  score: Score | null;
}
export const LabelRankBlock = ({ score, loading }: Props) => {
  const { t } = useTranslation();

  return (
    <Box>
      {score ? (
        <>
          <Box>
            <Typography
              variant="h4"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {score.rank}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {` ${t("commun.points")} `}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h4"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {score.victory}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {t("commun.victoryabbreviation")}
            </Typography>
            <Typography
              variant="h2"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {` - `}
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {score.draw}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {t("commun.drawabbreviation")}
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {` - `}
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {score.defeat}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="span"
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            >
              {t("commun.defeatabbreviation")}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography
          variant="h4"
          color="text.secondary"
          component="span"
          sx={{
            textShadow: "1px 1px 2px black",
          }}
        >
          {loading ? "" : t("commun.notrank")}
        </Typography>
      )}
    </Box>
  );
};
