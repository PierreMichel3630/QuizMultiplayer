import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  selectStatAccomplishment,
  selectStatAccomplishmentByProfile,
} from "src/api/accomplishment";
import { selectScore, selectScoresByTheme } from "src/api/score";
import { HeadTitle } from "src/component/HeadTitle";
import { BasicSelect, SelectIdTheme } from "src/component/Select";
import { DefaultTabs } from "src/component/Tabs";
import {
  DataRanking,
  DataRankingMe,
  RankingTable,
} from "src/component/table/RankingTable";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Score } from "src/models/Score";
import { getLevel } from "src/utils/calcul";

enum ClassementEnum {
  games = "games",
  gamestenpts = "gamestenpts",
  gamestwentypts = "gamestwentypts",
  gamesfiftypts = "gamesfiftypts",
  gameshundredpts = "gameshundredpts",
  themetenpts = "themetenpts",
  themetwentypts = "themetwentypts",
  duelgames = "duelgames",
  victoryduel = "victoryduel",
  drawduel = "drawduel",
  defeatduel = "defeatduel",
  xp = "xp",
  points = "points",
}
interface ValueOption {
  label: string;
  value: ClassementEnum;
}
export default function RankingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState(0);
  const tabs = [{ label: t("commun.global") }, { label: t("commun.pertheme") }];

  const [tabTheme, setTabTheme] = useState(0);
  const tabsTheme = [
    { label: t("commun.solo") },
    { label: t("commun.duel") },
    { label: t("commun.level") },
  ];

  const [mydata, setMyData] = useState<DataRankingMe | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [data, setData] = useState<Array<DataRanking>>([]);
  const [option, setOption] = useState<ClassementEnum>(
    searchParams.has("sort")
      ? (searchParams.get("sort") as ClassementEnum)
      : ClassementEnum.points
  );
  const [theme, setTheme] = useState("1");
  const [scores, setScores] = useState<Array<Score>>([]);
  const [loadingScore, setLoadingScore] = useState(true);

  const options: Array<ValueOption> = useMemo(
    () => [
      {
        label: t("ranking.bestgame"),
        value: ClassementEnum.points,
      },
      {
        label: t("ranking.xp"),
        value: ClassementEnum.xp,
      },
      {
        label: t("ranking.games"),
        value: ClassementEnum.games,
      },
      {
        label: t("ranking.gamestenpts"),
        value: ClassementEnum.gamestenpts,
      },
      {
        label: t("ranking.gamestwentypts"),
        value: ClassementEnum.gamestwentypts,
      },
      {
        label: t("ranking.gamesfiftypts"),
        value: ClassementEnum.gamesfiftypts,
      },
      {
        label: t("ranking.gameshundredpts"),
        value: ClassementEnum.gameshundredpts,
      },
      /*{
        label: t("ranking.themetenpts"),
        value: RankingEnum.themetenpts,
      },
      {
        label: t("ranking.themetwentypts"),
        value: RankingEnum.themetwentypts,
      },*/
      {
        label: t("ranking.duelgames"),
        value: ClassementEnum.duelgames,
      },
      {
        label: t("ranking.victoryduel"),
        value: ClassementEnum.victoryduel,
      },
      {
        label: t("ranking.drawduel"),
        value: ClassementEnum.drawduel,
      },
      {
        label: t("ranking.defeatduel"),
        value: ClassementEnum.defeatduel,
      },
    ],
    [t]
  );

  const dataDuel = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: el.rank,
      })) as Array<DataRanking>,
    [scores]
  );

  const dataSolo = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: el.points,
        uuid: el.uuidgame,
        extra: t("commun.pointsabbreviation"),
      })) as Array<DataRanking>,
    [scores, t]
  );

  const dataLvl = useMemo(
    () =>
      scores.map((el) => ({
        profile: el.profile,
        value: getLevel(el.xp),
      })) as Array<DataRanking>,
    [scores]
  );

  const dataTheme = useMemo(() => {
    let res = dataLvl;
    if (tabTheme === 0) {
      res = dataSolo;
    } else if (tabTheme === 1) {
      res = dataDuel;
    }
    return res;
  }, [dataDuel, dataLvl, dataSolo, tabTheme]);

  useEffect(() => {
    const getScores = () => {
      if (theme) {
        setLoadingScore(true);
        const order =
          tabTheme === 0 ? "points" : tabTheme === 1 ? "rank" : "xp";
        selectScoresByTheme(Number(theme), order).then(({ data }) => {
          setScores(data as Array<Score>);
          setLoadingScore(false);
        });
      }
    };
    getScores();
  }, [theme, tabTheme]);

  useEffect(() => {
    if (option === ClassementEnum.points) {
      selectScore(option).then(({ data }) => {
        const res = data as Array<Score>;
        setData(
          res.map((el) => {
            const champ = el[option];
            return {
              profile: el.profile,
              value: Array.isArray(champ) ? champ.length : champ,
              theme: el.theme,
            };
          })
        );
      });
    } else {
      selectStatAccomplishment(option).then(({ data }) => {
        const res = data as Array<StatAccomplishment>;
        setData(
          res.map((el) => {
            const champ = el[option];
            return {
              profile: el.profile,
              value: Array.isArray(champ) ? champ.length : champ,
            };
          })
        );
      });
    }
  }, [option]);

  useEffect(() => {
    const getMyStat = () => {
      if (user) {
        selectStatAccomplishmentByProfile(user.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [user]);

  useEffect(() => {
    if (stat) {
      if (option === ClassementEnum.points) {
        // DO
      } else {
        const champ = stat[option];
        setMyData({
          profile: stat.profile,
          rank: undefined,
          value: Array.isArray(champ) ? champ.length : champ,
        });
      }
    } else {
      setMyData(undefined);
    }
  }, [stat, option]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.people.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("commun.ranking")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DefaultTabs values={tabs} tab={tab} onChange={setTab} />
            </Grid>
            {tab === 0 ? (
              <>
                <Grid item xs={12}>
                  <BasicSelect
                    label={t("commun.rankingby")}
                    placeholder={t("commun.rankingby")}
                    options={options}
                    value={option}
                    onChange={(value) => setOption(value as ClassementEnum)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RankingTable data={data} me={mydata} />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <SelectIdTheme
                    theme={theme}
                    onChange={(value) => {
                      setLoadingScore(true);
                      setTheme(value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 1 }}>
                    <DefaultTabs
                      values={tabsTheme}
                      tab={tabTheme}
                      onChange={(value) => {
                        setLoadingScore(true);
                        setTabTheme(value);
                      }}
                    />
                    <RankingTable data={dataTheme} loading={loadingScore} />
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
