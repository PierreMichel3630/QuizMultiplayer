import { Box, Grid, Switch, Typography } from "@mui/material";
import { percent } from "csx";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { selectStatAccomplishment } from "src/api/accomplishment";
import { selectSoloGameByDate } from "src/api/game";
import { selectProfile } from "src/api/profile";
import { getRankingFinishTheme } from "src/api/ranking";
import { selectScore } from "src/api/score";
import { MoneyArrondieBlock } from "src/component/MoneyBlock";
import { StreakBlock } from "src/component/StreakBlock";
import {
  GroupButtonChallengeGlobal,
  GroupButtonClassement,
  GroupButtonOthersClassement,
} from "src/component/button/ButtonGroup";
import { ButtonRankingDuel } from "src/component/button/ButtonRankingDuel";
import { ButtonRankingSolo } from "src/component/button/ButtonRankingSolo";
import { WinBlock } from "src/component/challenge/WinBlock";
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
import { Profile } from "src/models/Profile";
import { Score } from "src/models/Score";
import {
  ClassementChallengeGlobalTimeEnum,
  ClassementDuelModeEnum,
  ClassementEnum,
  ClassementOtherEnum,
  ClassementSoloModeEnum,
} from "src/models/enum/ClassementEnum";
import { getLevel } from "src/utils/calcul";

export default function RankingPage() {
  const { t } = useTranslation();
  const { headerSize, idsFriend } = useApp();
  const { profile } = useAuth();
  const { language } = useUser();
  const [searchParams] = useSearchParams();

  const ITEMPERPAGE = 25;

  const [loading, setLoading] = useState(false);
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
  const [tabOthers, setTabOthers] = useState(ClassementOtherEnum.xp);
  const [tabChallengeMode, setTabChallengeMode] = useState(
    ClassementChallengeGlobalTimeEnum.windaychallenge
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const getDataRanking = useCallback(
    (page: number) => {
      const ids = isOnlyFriend ? idsFriend : [];
      setLoading(true);
      if ((page === 0 || !isEnd) && language) {
        if (
          type === ClassementEnum.points &&
          (tabSoloMode === ClassementSoloModeEnum.day ||
            tabSoloMode === ClassementSoloModeEnum.week ||
            tabSoloMode === ClassementSoloModeEnum.month)
        ) {
          let start: Moment | undefined = undefined;
          if (tabSoloMode === ClassementSoloModeEnum.month) {
            start = moment().subtract(1, "month");
          } else if (tabSoloMode === ClassementSoloModeEnum.week) {
            start = moment().subtract(1, "week");
          } else {
            start = undefined;
          }
          selectSoloGameByDate(language, page, ITEMPERPAGE, start).then(
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
              setLoading(false);
            }
          );
        } else if (
          (type === ClassementEnum.points &&
            tabSoloMode === ClassementSoloModeEnum.alltime) ||
          (type === ClassementEnum.rank &&
            tabDuelMode === ClassementDuelModeEnum.bestrank)
        ) {
          selectScore(language, type, page, ITEMPERPAGE, [], ids).then(
            ({ data }) => {
              const res = data as Array<Score>;
              const newdata = res.map((el, index) => {
                const champ = el[type];
                return {
                  profile: el.profile,
                  value: Array.isArray(champ) ? champ.length : champ,
                  theme: el.theme,
                  rank: page * ITEMPERPAGE + index + 1,
                  size: 80,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
              setLoading(false);
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
            setLoading(false);
          });
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
            setLoading(false);
          });
        } else if (type === ClassementEnum.others) {
          if (tabOthers === ClassementOtherEnum.xp) {
            selectStatAccomplishment(tabOthers, page, ITEMPERPAGE, ids).then(
              ({ data }) => {
                const res = data as Array<StatAccomplishment>;
                const newdata = res.map((el, index) => {
                  const value: any = el[tabOthers];
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
                setLoading(false);
              }
            );
          } else if (tabOthers === ClassementOtherEnum.streak) {
            selectProfile(
              { value: tabOthers, ascending: false },
              page,
              ITEMPERPAGE,
              ids
            ).then(({ data }) => {
              const res = data as Array<Profile>;
              const newdata = res.map((el, index) => {
                const value = el[tabOthers] as number;
                return {
                  profile: el,
                  value: <StreakBlock value={value} />,
                  rank: page * ITEMPERPAGE + index + 1,
                  size: 80,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
              setLoading(false);
            });
          } else if (tabOthers === ClassementOtherEnum.money) {
            selectProfile(
              { value: tabOthers, ascending: false },
              page,
              ITEMPERPAGE,
              ids
            ).then(({ data }) => {
              const res = data as Array<Profile>;
              const newdata = res.map((el, index) => {
                const value: any = el[tabOthers];
                return {
                  profile: el,
                  value: (
                    <MoneyArrondieBlock money={value} language={language} />
                  ),
                  rank: page * ITEMPERPAGE + index + 1,
                  size: 100,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
              setLoading(false);
            });
          }
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
                  size:
                    tabSoloMode === ClassementSoloModeEnum.pointssolo ? 80 : 60,
                };
              });
              setIsEnd(newdata.length < ITEMPERPAGE);
              setData((prev) =>
                page === 0 ? [...newdata] : [...prev, ...newdata]
              );
              setLoading(false);
            }
          );
        }
      }
    },
    [
      isOnlyFriend,
      idsFriend,
      isEnd,
      language,
      type,
      tabSoloMode,
      tabDuelMode,
      tabChallengeMode,
      tabOthers,
    ]
  );

  useEffect(() => {
    setPage(0);
    setData([]);
    setIsEnd(false);
    getDataRanking(0);
  }, [
    type,
    tabSoloMode,
    tabDuelMode,
    tabChallengeMode,
    tabOthers,
    isOnlyFriend,
    idsFriend,
    language,
  ]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getDataRanking(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [loading, isEnd, getDataRanking]);

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
        {type === ClassementEnum.others && (
          <GroupButtonOthersClassement
            selected={tabOthers}
            onChange={(value) => {
              setIsEnd(false);
              setPage(0);
              setData([]);
              setTabOthers(value);
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
        <RankingTable data={data} loading={!isEnd} lastItemRef={lastItemRef} />
      </Grid>
    </Grid>
  );
}
