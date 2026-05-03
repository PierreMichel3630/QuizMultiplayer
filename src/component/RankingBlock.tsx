import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectSoloGameByDate } from "src/api/game";
import { selectScore } from "src/api/score";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import {
  ClassementScoreEnum,
  ClassementSoloTimeEnum
} from "src/models/enum/ClassementEnum";
import { AllGameModeEnum } from "src/models/enum/GameEnum";
import { SoloGame } from "src/models/Game";
import { Score } from "src/models/Score";
import {
  GroupButtonAllGameMode,
  GroupButtonTime,
  GroupButtonTypeGame
} from "./button/ButtonGroup";
import { RankingChallengePerDate } from "./ranking/RankingChallenge";
import { DataRanking, RankingTable } from "./table/RankingTable";

interface Props {
  themes?: Array<number>;
}

export const RankingBlock = ({ themes }: Props) => {
  const { language } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(ClassementScoreEnum.points);
  const [data, setData] = useState<Array<DataRanking>>([]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    const ids = themes ?? [];
    if (language) {
      selectScore(tab, 0, 3, language, ids).then(({ data }) => {
        const res = data as Array<Score>;
        const newdata = res.map((el, index) => {
          const champ = el[tab];
          return {
            profile: el.profile,
            value: Array.isArray(champ) ? champ.length : champ,
            theme: el.theme,
            rank: index + 1,
            size: 60,
          };
        });
        setData(newdata);
        setIsLoading(false);
      });
    }
  }, [themes, tab, language]);

  return (
    <Grid container spacing={1}>
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
        size={12}
      >
        <GroupButtonTypeGame
          selected={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      </Grid>
      <Grid size={12}>
        <RankingTable data={data} loading={isLoading} />
      </Grid>
      <Grid size={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};

export const RankingTop5Block = () => {

  const [tab, setTab] = useState(AllGameModeEnum.challenge);

  const ITEM_PER_PAGE = 5

  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} alignItems="center">
        <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
          <GroupButtonAllGameMode
            selected={tab}
            onChange={(value) => {
              setTab(value);
            }}
          />
        </Grid>
        <Grid size={12}>
          {
            {
              duel: <RankingTop5BlockOther tab={tab} />,
              solo: <RankingTop5BlockOther tab={tab} />,
              challenge: <RankingChallengePerDate itemPerPage={ITEM_PER_PAGE} canChangeDate={false} />,
            }[tab]
          }
        </Grid>
      </Grid>
    </Container>
  );
};

interface PropsRankingTop5BlockOther{
  tab: AllGameModeEnum
}
export const RankingTop5BlockOther = ({tab}: PropsRankingTop5BlockOther) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { hasPlayChallenge } = useAuth();

  const [tabTimeSolo, setTabTimeSolo] = useState(ClassementSoloTimeEnum.week);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<DataRanking>>([]);

  useEffect(() => {
    setIsLoading(true);
    setData([]);
    if (language) {
      if (tab === AllGameModeEnum.duel) {
        selectScore("rank", 0, 5, language).then(({ data }) => {
          const res = data as Array<Score>;
          const newdata = res.map((el, index) => {
            const champ = el.rank;
            return {
              profile: el.profile,
              value: (
                <Typography variant="h2" noWrap>
                  {champ}
                </Typography>
              ),
              theme: el.theme,
              rank: index + 1,
              size: 70,
            };
          });
          setData(newdata);
          setIsLoading(false);
        });
      } else if (tab === AllGameModeEnum.solo) {
        let start: Moment | undefined = undefined;
        if (tabTimeSolo === ClassementSoloTimeEnum.month) {
          start = moment().subtract(1, "month");
        } else if (tabTimeSolo === ClassementSoloTimeEnum.week) {
          start = moment().subtract(1, "week");
        } else {
          start = undefined;
        }
        selectSoloGameByDate(language, 0, 5, start).then(({ data }) => {
          const res = data as Array<SoloGame>;
          const newdata = res.map((el, index) => {
            return {
              profile: el.profile,
              value: (
                <Typography variant="h2" noWrap>
                  {el.points}
                </Typography>
              ),
              theme: el.theme,
              rank: index + 1,
              size: 60,
            };
          });
          setData(newdata);
          setIsLoading(false);
        });
      }
    }
  }, [tab, tabTimeSolo, t, language, hasPlayChallenge]);

  const link = useMemo(() => {
    let res = "";
    if (tab === AllGameModeEnum.solo) {
      res = `/ranking?sort=points&time=${tabTimeSolo}`;
    } else if (tab === AllGameModeEnum.duel) {
      res = `/ranking?sort=rank`;
    }
    return res;
  }, [tab, tabTimeSolo]);

  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} alignItems="center">
        {tab === AllGameModeEnum.solo && (
          <Grid size={12}>
            <GroupButtonTime
              selected={tabTimeSolo}
              onChange={(value) => {
                setTabTimeSolo(value);
              }}
            />
          </Grid>
        )}
        <Grid size={12}>
          <Box sx={{ p: 1 }}>
            <RankingTable
              data={data}
              loading={isLoading}
              navigation={{
                link: link,
                label: t("commun.seemore"),
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
