import { Box, Grid, Switch, Typography } from "@mui/material";
import { percent } from "csx";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { selectStatAccomplishment } from "src/api/accomplishment";
import { selectGamesByTime } from "src/api/game";
import { getRankingFinishTheme } from "src/api/ranking";
import { selectScore } from "src/api/score";
import {
  GroupButtonChallengeGlobal,
  GroupButtonClassement,
} from "src/component/button/ButtonGroup";
import { ButtonRankingDuel } from "src/component/button/ButtonRankingDuel";
import { ButtonRankingSolo } from "src/component/button/ButtonRankingSolo";
import { WinBlock } from "src/component/challenge/winBlock";
import { DataRanking, RankingTable } from "src/component/table/RankingTable";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { BadgeLevel } from "src/icons/BadgeLevel";
import {
  StatAccomplishment,
  StatAccomplishmentEnum,
} from "src/models/Accomplishment";
import { FinishTheme } from "src/models/FinishTheme";
import { Score } from "src/models/Score";
import {
  ClassementChallengeGlobalTimeEnum,
  ClassementDuelModeEnum,
  ClassementEnum,
  ClassementSoloModeEnum,
  ClassementSoloTimeEnum,
} from "src/models/enum/ClassementEnum";
import { getLevel } from "src/utils/calcul";

export default function RankingPage() {
  const { t } = useTranslation();
  const { headerSize, idsFriend } = useApp();
  const { profile } = useAuth();
  const { language } = useUser();
  const [searchParams] = useSearchParams();

  const ITEMPERPAGE = 25;

  const [isOnlyFriend, setIsOnlyFriend] = useState(false);
  const [type, setType] = useState(
    searchParams.has("sort")
      ? (searchParams.get("sort") as ClassementEnum)
      : ClassementEnum.points
  );
  const [data, setData] = useState<Array<DataRanking>>([]);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [tabSoloMode, setTabSoloMode] = useState(
    searchParams.has("time")
      ? (searchParams.get("time") as ClassementSoloModeEnum)
      : ClassementSoloModeEnum.alltime
  );
  const [tabDuelMode, setTabDuelMode] = useState(
    ClassementDuelModeEnum.bestrank
  );

  const [tabChallengeMode, setTabChallengeMode] = useState(
    ClassementChallengeGlobalTimeEnum.windaychallenge
  );

  const getDataRanking = useCallback(
    (page: number) => {
      const ids = isOnlyFriend ? idsFriend : [];
      if (page === 0 || !isEnd) {
        if (
          type === ClassementEnum.points &&
          (tabSoloMode === ClassementSoloModeEnum.day ||
            tabSoloMode === ClassementSoloModeEnum.week ||
            tabSoloMode === ClassementSoloModeEnum.month)
        ) {
          const time = tabSoloMode as unknown as ClassementSoloTimeEnum;
          selectGamesByTime(time, page, ITEMPERPAGE, language.iso, ids).then(
            ({ data }) => {
              const res: Array<any> = data ?? [];
              const newdata = [...res].map((el, index) => ({
                profile: el.profile,
                value: el.points,
                theme: el.theme,
                rank: page * ITEMPERPAGE + index + 1,
                size: 60,
              }));
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
            }
          );
        } else if (
          (type === ClassementEnum.points &&
            tabSoloMode === ClassementSoloModeEnum.alltime) ||
          (type === ClassementEnum.rank &&
            tabDuelMode === ClassementDuelModeEnum.bestrank)
        ) {
          selectScore(type, page, ITEMPERPAGE, language.iso, [], ids).then(
            ({ data }) => {
              const res = data as Array<Score>;
              const newdata = res.map((el, index) => {
                const champ = el[type];
                return {
                  profile: el.profile,
                  value: Array.isArray(champ) ? champ.length : champ,
                  theme: el.theme,
                  rank: page * ITEMPERPAGE + index + 1,
                  size: 60,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
            }
          );
        } else if (
          type === ClassementEnum.points &&
          tabSoloMode === ClassementSoloModeEnum.finishtheme
        ) {
          getRankingFinishTheme(page, ITEMPERPAGE, ids).then(({ data }) => {
            const res = data as Array<FinishTheme>;
            const newdata = res.map((el, index) => ({
              profile: el.profile,
              value: el.nbtheme,
              rank: page * ITEMPERPAGE + index + 1,
              size: 60,
            }));
            setIsEnd(newdata.length < ITEMPERPAGE);
            setData((prev) =>
              page === 0 ? [...newdata] : [...prev, ...newdata]
            );
          });
        } else if (type === ClassementEnum.xp) {
          selectStatAccomplishment(type, page, ITEMPERPAGE, ids).then(
            ({ data }) => {
              const res = data as Array<StatAccomplishment>;
              const newdata = res.map((el, index) => {
                const value: any = el[type];
                return {
                  profile: el.profile,
                  value: (
                    <BadgeLevel
                      level={getLevel(value)}
                      size={35}
                      fontSize={15}
                    />
                  ),
                  rank: page * ITEMPERPAGE + index + 1,
                  size: 50,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
            }
          );
        } else if (type === ClassementEnum.challenge) {
          selectStatAccomplishment(
            tabChallengeMode,
            page,
            ITEMPERPAGE,
            ids
          ).then(({ data }) => {
            const res = data as Array<StatAccomplishment>;
            const newdata = res.map((el, index) => {
              const champ = el[tabChallengeMode];
              return {
                profile: el.profile,
                value: <WinBlock value={champ} />,
                rank: page * ITEMPERPAGE + index + 1,
                size: 60,
              };
            });
            setIsEnd(newdata.length < ITEMPERPAGE);
            setData((prev) =>
              page === 0 ? [...newdata] : [...prev, ...newdata]
            );
          });
        } else {
          const order = (type === ClassementEnum.points
            ? tabSoloMode
            : tabDuelMode) as unknown as StatAccomplishmentEnum;
          selectStatAccomplishment(order, page, ITEMPERPAGE, ids).then(
            ({ data }) => {
              const res = data as Array<StatAccomplishment>;
              const newdata = res.map((el, index) => {
                const champ = el[order];
                return {
                  profile: el.profile,
                  value: Array.isArray(champ) ? champ.length : champ,
                  rank: page * ITEMPERPAGE + index + 1,
                  size: 60,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
            }
          );
        }
      }
    },
    [
      isOnlyFriend,
      idsFriend,
      isEnd,
      type,
      tabSoloMode,
      tabDuelMode,
      tabChallengeMode,
      language.iso,
    ]
  );

  useEffect(() => {
    getDataRanking(0);
  }, [getDataRanking]);

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getDataRanking(nextPage);
      return nextPage;
    });
  };

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
        {type === ClassementEnum.challenge && (
          <GroupButtonChallengeGlobal
            selected={tabChallengeMode}
            onChange={(value) => {
              setIsEnd(false);
              setPage(0);
              setData([]);
              setTabChallengeMode(value);
            }}
          />
        )}
      </Grid>
      {profile && (
        <Grid item xs={12} sx={{ pl: 1, pr: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              width: percent(100),
            }}
          >
            <Switch
              color="secondary"
              checked={isOnlyFriend}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPage(0);
                setIsOnlyFriend(event.target.checked);
              }}
            />
            <Typography variant="body1">{t("commun.onlyfriend")}</Typography>
          </Box>
        </Grid>
      )}

      <Grid item xs={12} sx={{ p: 1 }}>
        <InfiniteScroll
          dataLength={data.length}
          next={handleLoadMoreData}
          hasMore={!isEnd}
          loader={undefined}
        >
          <RankingTable data={data} loading={!isEnd} />
        </InfiniteScroll>
      </Grid>
    </Grid>
  );
}
