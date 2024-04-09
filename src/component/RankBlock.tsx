import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectRankByThemeAndPlayer } from "src/api/rank";
import { MyRank } from "src/models/Rank";

interface Props {
  player: string;
  theme: number;
}
export const LabelRankBlock = ({ player, theme }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rankPlayer, setRankPlayer] = useState<MyRank | undefined>(undefined);
  useEffect(() => {
    const getRank = () => {
      selectRankByThemeAndPlayer(player, theme).then(({ data }) => {
        const res = data as MyRank;
        setRankPlayer(res.id !== null ? res : undefined);
        setLoading(false);
      });
    };
    getRank();
  }, [player, theme]);

  const getPosition = (rank: number) => {
    let result = t("commun.first");
    switch (rank) {
      case 1:
        result = t("commun.first");
        break;
      case 2:
        result = t("commun.second");
        break;
      case 3:
        result = t("commun.third");
        break;
      default:
        result = t("commun.position", { position: rank });
    }
    return result;
  };

  return (
    <Box>
      {rankPlayer ? (
        <Box>
          <Typography variant="h4" color="text.secondary" component="span">
            {rankPlayer.points}
          </Typography>
          <Typography variant="body1" color="text.secondary" component="span">
            {` ${t("commun.points")} `}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 12 }}
            color="text.secondary"
            component="span"
          >
            ({getPosition(rankPlayer.rank)})
          </Typography>
        </Box>
      ) : (
        <Typography variant="h4" color="text.secondary" component="span">
          {loading ? "" : t("commun.notrank")}
        </Typography>
      )}
    </Box>
  );
};
