import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { selectGamesByTime } from "src/api/game";
import { selectScore } from "src/api/score";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import {
  ClassementScoreEnum,
  ClassementTimeEnum,
} from "src/models/enum/ClassementEnum";
import { HistorySoloGame } from "src/models/Game";
import { Score } from "src/models/Score";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { DataRanking, RankingTable } from "./table/RankingTable";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

interface Props {
  themes?: Array<number>;
}

export const RankingBlock = ({ themes }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<Array<Score>>([]);
  const [tab, setTab] = useState(ClassementScoreEnum.points);

  const options = useMemo(
    () => [
      {
        label: t("commun.solo"),
        value: ClassementScoreEnum.points,
      },
      {
        label: t("commun.duel"),
        value: ClassementScoreEnum.rank,
      },
    ],
    [t]
  );

  useEffect(() => {
    const getRank = () => {
      setIsLoading(true);
      const ids = themes ? themes : [];
      selectScore(tab, 0, 3, ids).then(({ data }) => {
        setScores(data as Array<Score>);
        setIsLoading(false);
      });
    };
    getRank();
  }, [themes, tab]);

  const score0 = useMemo(
    () => (scores.length > 0 ? scores[0] : undefined),
    [scores]
  );

  const score1 = useMemo(
    () => (scores.length > 1 ? scores[1] : undefined),
    [scores]
  );

  const score2 = useMemo(
    () => (scores.length > 2 ? scores[2] : undefined),
    [scores]
  );

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
          onClick={() => navigate(`/ranking?sort=${tab}`)}
        >
          <Typography variant="h6" noWrap>
            {t("commun.seeall")}
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          color="primary"
          value={tab}
          exclusive
          onChange={(
            _event: React.MouseEvent<HTMLElement>,
            newValue: string
          ) => {
            setTab(newValue as ClassementScoreEnum);
          }}
          aria-label="typegame"
        >
          {options.map((option) => (
            <ToggleButton
              key={option.value}
              value={option.value}
              sx={{ p: "2px 8px" }}
            >
              <Typography variant="h6" noWrap>
                {option.label}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={12}>
        {isLoading ? (
          <Box sx={{ display: "flex", gap: px(2), alignItems: "flex-end" }}>
            <Skeleton width={"100%"} height={170} />
            <Skeleton width={"100%"} height={180} />
            <Skeleton width={"100%"} height={150} />
          </Box>
        ) : (
          <Box>
            <Container maxWidth="md">
              <Grid container spacing={1}>
                {score1 && (
                  <Grid item xs={4} sx={{ display: "flex" }}>
                    <RankingGame score={score1} rank={2} value={score1[tab]} />
                  </Grid>
                )}
                {score0 && (
                  <Grid item xs={4} sx={{ display: "flex" }}>
                    <RankingGame score={score0} rank={1} value={score0[tab]} />
                  </Grid>
                )}
                {score2 && (
                  <Grid item xs={4} sx={{ display: "flex" }}>
                    <RankingGame score={score2} rank={3} value={score2[tab]} />
                  </Grid>
                )}
              </Grid>
            </Container>
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
  value: number;
}
const RankingGame = ({ score, rank, value }: PropsRankingGame) => {
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
        icon = <Avatar sx={{ width: 50, height: 50, p: px(5) }} src={rank1} />;
        break;
      case 2:
        color = Colors.silver;
        icon = <Avatar sx={{ width: 45, height: 45, p: px(5) }} src={rank2} />;
        break;
      case 3:
        color = Colors.bronze;
        icon = <Avatar sx={{ width: 40, height: 40, p: px(5) }} src={rank3} />;
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
          <AvatarAccount avatar={score.profile.avatar.icon} size={60} />
          <Typography variant="h6">{score.profile.username}</Typography>
        </Link>
      </Box>
      <Box
        sx={{
          width: percent(100),
          height: px(170 - rank * 15),
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
        <Box
          sx={{
            width: percent(100),
            textAlign: "center",
          }}
        >
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
              sx={{
                width: percent(100),
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            />
          </Link>
          <Typography variant="h2" color="text.secondary" component="span">
            {value}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const RankingTop5Block = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tab, setTab] = useState(ClassementScoreEnum.points);
  const [tabTime, setTabTime] = useState(ClassementTimeEnum.week);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<DataRanking>>([]);

  const options = useMemo(
    () => [
      {
        icon: <PlayCircleIcon />,
        label: t("commun.solo"),
        value: ClassementScoreEnum.points,
      },
      {
        icon: <OfflineBoltIcon />,
        label: t("commun.duel"),
        value: ClassementScoreEnum.rank,
      },
    ],
    [t]
  );

  const optionsTime = useMemo(
    () => [
      {
        label: t("commun.week"),
        value: ClassementTimeEnum.week,
      },
      {
        label: t("commun.month"),
        value: ClassementTimeEnum.month,
      },
      {
        label: t("commun.alltime"),
        value: ClassementTimeEnum.alltime,
      },
    ],
    [t]
  );

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    if (
      tab === ClassementScoreEnum.rank ||
      (tab === ClassementScoreEnum.points &&
        tabTime === ClassementTimeEnum.alltime)
    ) {
      selectScore(tab, 0, 5).then(({ data }) => {
        const res = data as Array<Score>;
        const newdata = res.map((el, index) => {
          const champ = el[tab];
          return {
            profile: el.profile,
            value: Array.isArray(champ) ? champ.length : champ,
            theme: el.theme,
            rank: index + 1,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    } else {
      selectGamesByTime(tabTime, 5).then(({ data }) => {
        const res = data as Array<HistorySoloGame>;
        const newdata = res.map((el, index) => {
          return {
            profile: el.profile,
            value: el.points,
            theme: el.theme,
            rank: index + 1,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    }
  }, [tab, tabTime]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography variant="h2">{t("commun.ranking")}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ToggleButtonGroup
          color="primary"
          value={tab}
          exclusive
          onChange={(
            _event: React.MouseEvent<HTMLElement>,
            newValue: string
          ) => {
            setTab(newValue as ClassementScoreEnum);
          }}
          aria-label="typegame"
        >
          {options.map((option) => (
            <ToggleButton
              key={option.value}
              value={option.value}
              sx={{
                p: "2px 8px",
              }}
            >
              {option.icon}
              <Typography variant="h6" noWrap>
                {option.label}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
      {tab === ClassementScoreEnum.points && (
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            color="primary"
            value={tabTime}
            exclusive
            onChange={(
              _event: React.MouseEvent<HTMLElement>,
              newValue: string
            ) => {
              if (newValue !== null) setTabTime(newValue as ClassementTimeEnum);
            }}
            aria-label="timegame"
          >
            {optionsTime.map((option) => (
              <ToggleButton
                key={option.value}
                value={option.value}
                sx={{ p: "2px 8px" }}
              >
                <Typography variant="h6" noWrap>
                  {option.label}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      )}
      <Grid item xs={12}>
        <RankingTable data={data} loading={isLoading} />
      </Grid>
      <Grid item xs={12}>
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
          fullWidth
          onClick={() => navigate(`/ranking?sort=${tab}`)}
        >
          <Typography variant="h6" noWrap>
            {t("commun.seeall")}
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
