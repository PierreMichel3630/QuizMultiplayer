import { Box, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { selectStatAccomplishment } from "src/api/accomplishment";
import { selectGamesByTime } from "src/api/game";
import { getRankingFinishTheme } from "src/api/ranking";
import { selectScore } from "src/api/score";
import { GroupButtonClassement } from "src/component/button/ButtonGroup";
import { ButtonRankingDuel } from "src/component/button/ButtonRankingDuel";
import { ButtonRankingSolo } from "src/component/button/ButtonRankingSolo";
import { DataRanking, RankingTable } from "src/component/table/RankingTable";
import { useApp } from "src/context/AppProvider";
import { BadgeLevel } from "src/icons/BadgeLevel";
import useScrollListener from "src/listener/useScrollListener";
import {
  StatAccomplishment,
  StatAccomplishmentEnum,
} from "src/models/Accomplishment";
import { FinishTheme } from "src/models/FinishTheme";
import { Score } from "src/models/Score";
import {
  ClassementDuelModeEnum,
  ClassementEnum,
  ClassementSoloModeEnum,
  ClassementSoloTimeEnum,
} from "src/models/enum/ClassementEnum";
import { getLevel } from "src/utils/calcul";
import { sortByRankAsc } from "src/utils/sort";

export default function RankingPage() {
  const { t } = useTranslation();
  const { headerSize } = useApp();
  const [searchParams] = useSearchParams();

  const ITEMPERPAGE = 25;

  const [type, setType] = useState(
    searchParams.has("sort")
      ? (searchParams.get("sort") as ClassementEnum)
      : ClassementEnum.points
  );
  const [data, setData] = useState<Array<DataRanking>>([]);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [tabSoloMode, setTabSoloMode] = useState(
    searchParams.has("time")
      ? (searchParams.get("time") as ClassementSoloModeEnum)
      : ClassementSoloModeEnum.alltime
  );
  const [tabDuelMode, setTabDuelMode] = useState(
    ClassementDuelModeEnum.bestrank
  );

  useEffect(() => {
    if (!isEnd) {
      if (
        type === ClassementEnum.points &&
        (tabSoloMode === ClassementSoloModeEnum.day ||
          tabSoloMode === ClassementSoloModeEnum.week ||
          tabSoloMode === ClassementSoloModeEnum.month)
      ) {
        const time = tabSoloMode as unknown as ClassementSoloTimeEnum;
        selectGamesByTime(time, page, ITEMPERPAGE).then(({ data }) => {
          const res: Array<any> = data ?? [];
          const newdata = [...res].map((el, index) => ({
            profile: el.profile,
            value: el.points,
            theme: el.theme,
            rank: page * ITEMPERPAGE + index + 1,
          }));
          setIsEnd(newdata.length < ITEMPERPAGE);
          setData((prev) => [...prev, ...newdata].sort(sortByRankAsc));
        });
      } else if (
        (type === ClassementEnum.points &&
          tabSoloMode === ClassementSoloModeEnum.alltime) ||
        (type === ClassementEnum.rank &&
          tabDuelMode === ClassementDuelModeEnum.bestrank)
      ) {
        selectScore(type, page, ITEMPERPAGE).then(({ data }) => {
          const res = data as Array<Score>;
          const newdata = res.map((el, index) => {
            const champ = el[type];
            return {
              profile: el.profile,
              value: Array.isArray(champ) ? champ.length : champ,
              theme: el.theme,
              rank: page * ITEMPERPAGE + index + 1,
            };
          });
          setIsEnd(newdata.length < ITEMPERPAGE);
          setData((prev) => [...prev, ...newdata].sort(sortByRankAsc));
        });
      } else if (
        type === ClassementEnum.points &&
        tabSoloMode === ClassementSoloModeEnum.finishtheme
      ) {
        getRankingFinishTheme(page, ITEMPERPAGE).then(({ data }) => {
          const res = data as Array<FinishTheme>;
          const newdata = res.map((el, index) => ({
            profile: el.profile,
            value: el.nbtheme,
            rank: page * ITEMPERPAGE + index + 1,
          }));
          setIsEnd(newdata.length < ITEMPERPAGE);
          setData((prev) => [...prev, ...newdata].sort(sortByRankAsc));
        });
      } else if (type === ClassementEnum.xp) {
        selectStatAccomplishment(type, page, ITEMPERPAGE).then(({ data }) => {
          const res = data as Array<StatAccomplishment>;
          const newdata = res.map((el, index) => {
            const value: any = el[type];
            return {
              profile: el.profile,
              value: (
                <BadgeLevel level={getLevel(value)} size={35} fontSize={15} />
              ),
              rank: page * ITEMPERPAGE + index + 1,
              size: 50,
            };
          });
          setIsEnd(newdata.length < ITEMPERPAGE);
          setData((prev) => [...prev, ...newdata].sort(sortByRankAsc));
        });
      } else {
        const order = (type === ClassementEnum.points
          ? tabSoloMode
          : tabDuelMode) as unknown as StatAccomplishmentEnum;
        selectStatAccomplishment(order, page, ITEMPERPAGE).then(({ data }) => {
          const res = data as Array<StatAccomplishment>;
          const newdata = res.map((el, index) => {
            const champ = el[order];
            return {
              profile: el.profile,
              value: Array.isArray(champ) ? champ.length : champ,
              rank: page * ITEMPERPAGE + index + 1,
            };
          });
          setIsEnd(newdata.length < ITEMPERPAGE);
          setData((prev) => [...prev, ...newdata]);
        });
      }
    }
  }, [page, type, tabSoloMode, tabDuelMode, isEnd]);

  const handleScroll = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useScrollListener(handleScroll);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.people.title")} - ${t("appname")}`}</title>
      </Helmet>
      <meta
        name="description"
        content="Comparez vos scores aux autres joueurs et voyez qui a le plus de connaissances"
      />
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: headerSize,
          backgroundColor: "background.paper",
          p: 1,
          zIndex: 10,
          display: "flex",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <GroupButtonClassement
          selected={type}
          onChange={(value) => {
            setIsEnd(false);
            setPage(0);
            setData([]);
            setType(value);
          }}
        />
        {type === ClassementEnum.points && (
          <ButtonRankingSolo
            value={tabSoloMode}
            onChange={(value) => {
              setIsEnd(false);
              setPage(0);
              setData([]);
              setTabSoloMode(value);
            }}
          />
        )}
        {type === ClassementEnum.rank && (
          <ButtonRankingDuel
            value={tabDuelMode}
            onChange={(value) => {
              setIsEnd(false);
              setPage(0);
              setData([]);
              setTabDuelMode(value);
            }}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Container maxWidth="sm">
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <RankingTable data={data} loading={!isEnd} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
