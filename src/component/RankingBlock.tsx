import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { selectScore } from "src/api/score";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { Score } from "src/models/Score";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

export const RankingBlock = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<Array<Score>>([]);

  useEffect(() => {
    const getRank = () => {
      setIsLoading(true);
      selectScore("points", 0, 3).then(({ data }) => {
        setScores(data as Array<Score>);
        setIsLoading(false);
      });
    };
    getRank();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="h2">{t("commun.ranking")}</Typography>
        <Button
          variant="outlined"
          sx={{
            minWidth: "auto",
            textTransform: "uppercase",
            "&:hover": {
              border: "2px solid currentColor",
            },
          }}
          color="secondary"
          size="small"
          onClick={() => navigate(`/ranking?sort=points`)}
        >
          <Typography variant="h6" noWrap>
            {t("commun.seeall")}
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        {isLoading ? (
          <Box sx={{ display: "flex", gap: px(2), alignItems: "flex-end" }}>
            <Skeleton width={"100%"} height={180} />
            <Skeleton width={"100%"} height={200} />
            <Skeleton width={"100%"} height={160} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: px(2) }}>
            {scores[1] && <RankingGame score={scores[1]} rank={2} />}
            {scores[0] && <RankingGame score={scores[0]} rank={1} />}
            {scores[2] && <RankingGame score={scores[2]} rank={3} />}
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};

interface PropsRankingGame {
  score: Score;
  rank: number;
}
const RankingGame = ({ score, rank }: PropsRankingGame) => {
  const rankCss = useMemo(() => {
    let color = Colors.grey4;
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey, width: 25, height: 25 }}>
        <Typography variant="h6" color="text.primary">
          {rank}
        </Typography>
      </Avatar>
    );
    switch (rank) {
      case 1:
        color = Colors.gold;
        icon = <Avatar sx={{ width: 45, height: 45, p: px(5) }} src={rank1} />;
        break;
      case 2:
        color = Colors.silver;
        icon = <Avatar sx={{ width: 45, height: 45, p: px(5) }} src={rank2} />;
        break;
      case 3:
        color = Colors.bronze;
        icon = <Avatar sx={{ width: 45, height: 45, p: px(5) }} src={rank3} />;
        break;
    }
    return { color, icon };
  }, [rank]);
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Link
          to={`/profil/${score.profile.id}`}
          style={{
            textDecoration: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AvatarAccount avatar={score.profile.avatar.icon} size={70} />
          <Typography variant="h6">{score.profile.username}</Typography>
        </Link>
      </Box>
      <Box
        sx={{
          width: percent(100),
          height: px(180 - rank * 20),
          backgroundColor: rankCss.color,
          borderTopRightRadius: px(10),
          borderTopLeftRadius: px(10),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          p: "10px 3px 3px 3px",
        }}
      >
        {rankCss.icon}
        <Box sx={{ textAlign: "center" }}>
          <Link
            to={`/theme/${score.theme.id}`}
            style={{
              textDecoration: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <JsonLanguageBlock
              variant="body1"
              color="text.secondary"
              value={score.theme.name}
            />
          </Link>
          <Typography variant="h2" color="text.secondary" component="span">
            {score.points}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
