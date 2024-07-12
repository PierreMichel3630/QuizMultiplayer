import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { Score } from "src/models/Score";

interface Props {
  player: string;
  theme: number;
}
export const LabelRankBlock = ({ player, theme }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<Score | null>(null);
  useEffect(() => {
    const getRank = () => {
      selectScoreByThemeAndPlayer(player, theme).then(({ data }) => {
        const res = data as Score;
        setScore(res);
        setLoading(false);
      });
    };
    getRank();
  }, [player, theme]);

  return (
    <Box>
      {score ? (
        <>
          <Box>
            <Typography variant="h4" color="text.secondary" component="span">
              {score.rank}
            </Typography>
            <Typography variant="body1" color="text.secondary" component="span">
              {` ${t("commun.points")} `}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="text.secondary" component="span">
              {score.victory}
            </Typography>
            <Typography variant="h6" color="text.secondary" component="span">
              {t("commun.victoryabbreviation")}
            </Typography>
            <Typography variant="h2" color="text.secondary" component="span">
              {` - `}
            </Typography>
            <Typography variant="h4" color="text.secondary" component="span">
              {score.draw}
            </Typography>
            <Typography variant="h6" color="text.secondary" component="span">
              {t("commun.drawabbreviation")}
            </Typography>
            <Typography variant="h4" color="text.secondary" component="span">
              {` - `}
            </Typography>
            <Typography variant="h4" color="text.secondary" component="span">
              {score.defeat}
            </Typography>
            <Typography variant="h6" color="text.secondary" component="span">
              {t("commun.defeatabbreviation")}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography variant="h4" color="text.secondary" component="span">
          {loading ? "" : t("commun.notrank")}
        </Typography>
      )}
    </Box>
  );
};
