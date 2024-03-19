import { Box, Button, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  selectScoreByThemeAndPlayer,
  selectScoresByTheme,
} from "src/api/score";
import { useUser } from "src/context/UserProvider";
import { MyScore, Score } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { RankingTable } from "../table/RankingTable";

interface Props {
  theme: Theme;
}

export const CardTheme = ({ theme }: Props) => {
  const { t } = useTranslation();
  const { language, uuid } = useUser();
  const navigate = useNavigate();

  const [scores, setScore] = useState<Array<Score>>([]);
  const [myScore, setMyScore] = useState<MyScore | undefined>(undefined);

  const name = theme.name[language.iso];

  useEffect(() => {
    const getScore = () => {
      selectScoresByTheme(theme.id).then(({ data }) => {
        setScore(data as Array<Score>);
      });
    };
    getScore();
  }, [theme]);

  useEffect(() => {
    const getMyRank = () => {
      selectScoreByThemeAndPlayer(uuid, theme.id).then(({ data }) => {
        const res = data as MyScore;
        setMyScore(res.id !== null ? res : undefined);
      });
    };
    getMyRank();
  }, [theme, uuid]);

  const joinRoom = () => {
    navigate(`/solo/${theme.id}`);
  };

  return (
    <Paper
      sx={{
        borderRadius: px(10),
        minHeight: px(300),
        padding: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.greyLightMode,
        backgroundImage: `url('${theme.image}')`,
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: px(5),
          alignItems: "center",
          width: percent(100),
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "white",
            textShadow: "2px 2px 4px black",
            wordWrap: "break-word",
            fontSize: 45,
            maxWidth: percent(100),
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "white", textShadow: "2px 2px 4px black" }}
        >
          {`${theme.questions} ${t("commun.questions")}`}
        </Typography>
        <RankingTable scores={scores} myscore={myScore} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => joinRoom()}
        >
          <Typography variant="h6">{t("commun.play")}</Typography>
        </Button>
      </Box>
    </Paper>
  );
};
