import { Alert, Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { selectBadgeByProfile } from "src/api/badge";
import { selectRankByProfile } from "src/api/rank";
import {
  selectOppositionByOpponent,
  selectScoresByProfile,
} from "src/api/score";
import { selectTitleByProfile } from "src/api/title";
import { HeadTitle } from "src/component/HeadTitle";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { LineCompareTable } from "src/component/LineCompareTable";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { CardBadge } from "src/component/card/CardBadge";
import { CardTitle } from "src/component/card/CardTitle";
import { BarVictory } from "src/component/chart/BarVictory";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { useUser } from "src/context/UserProvider";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Profile } from "src/models/Profile";
import { Rank } from "src/models/Rank";
import { Opposition, Score } from "src/models/Score";
import { Title, TitleProfile } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { sortByDuelGamesDesc, sortByName } from "src/utils/sort";

export const ComparePage = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const location = useLocation();

  const [profile1, setProfile1] = useState<Profile | undefined>(
    location.state ? location.state.profile1 : undefined
  );
  const [titles1, setTitles1] = useState<Array<Title>>([]);
  const [badges1, setBadges1] = useState<Array<Badge>>([]);
  const [scores1, setScores1] = useState<Array<Score>>([]);
  const [ranks1, setRanks1] = useState<Array<Rank>>([]);
  const [openModalFriend1, setOpenModalFriend1] = useState(false);

  const [profile2, setProfile2] = useState<Profile | undefined>(
    location.state ? location.state.profile2 : undefined
  );
  const [titles2, setTitles2] = useState<Array<Title>>([]);
  const [badges2, setBadges2] = useState<Array<Badge>>([]);
  const [scores2, setScores2] = useState<Array<Score>>([]);
  const [ranks2, setRanks2] = useState<Array<Rank>>([]);
  const [openModalFriend2, setOpenModalFriend2] = useState(false);

  const [oppositions, setOppositions] = useState<Array<Opposition>>([]);

  const getBadges = (uuid: string, set: (value: Array<Badge>) => void) => {
    selectBadgeByProfile(uuid).then(({ data }) => {
      const res = data as Array<BadgeProfile>;
      set(res.map((el) => el.badge));
    });
  };

  const getTitles = (uuid: string, set: (value: Array<Title>) => void) => {
    selectTitleByProfile(uuid).then(({ data }) => {
      const res = data as Array<TitleProfile>;
      set(res.map((el) => el.title));
    });
  };

  const getScore = (uuid: string, set: (value: Array<Score>) => void) => {
    selectScoresByProfile(uuid).then(({ data }) => {
      const res = data as Array<Score>;
      set(res.sort(sortByDuelGamesDesc));
    });
  };

  const getRank = (uuid: string, set: (value: Array<Rank>) => void) => {
    selectRankByProfile(uuid).then(({ data }) => {
      set(data as Array<Rank>);
    });
  };

  useEffect(() => {
    if (profile1) {
      getTitles(profile1.id, setTitles1);
      getBadges(profile1.id, setBadges1);
      getScore(profile1.id, setScores1);
      getRank(profile1.id, setRanks1);
    }
  }, [profile1]);

  useEffect(() => {
    if (profile2) {
      getTitles(profile2.id, setTitles2);
      getBadges(profile2.id, setBadges2);
      getScore(profile2.id, setScores2);
      getRank(profile2.id, setRanks2);
    }
  }, [profile2]);

  useEffect(() => {
    const getOpposition = () => {
      if (profile1 && profile2) {
        selectOppositionByOpponent(profile1.id, profile2.id).then(
          ({ data }) => {
            setOppositions(data as Array<Opposition>);
          }
        );
      }
    };
    getOpposition();
  }, [profile1, profile2]);

  const themes = useMemo(() => {
    const allthemes = [
      ...scores1.map((el) => el.theme),
      ...scores2.map((el) => el.theme),
    ];
    return uniqBy(allthemes, (el) => el.id).sort((a, b) =>
      sortByName(language, a, b)
    );
  }, [scores1, scores2, language]);

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.compare.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.compare.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <SelectorProfileBlock
                label={t("commun.selectplayer")}
                profile={profile1}
                onChange={() => setOpenModalFriend1(true)}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectorProfileBlock
                label={t("commun.selectplayer")}
                profile={profile2}
                onChange={() => setOpenModalFriend2(true)}
              />
            </Grid>
            {profile1 && profile2 ? (
              <>
                <Grid item xs={6}>
                  <CardBadge badges={badges1} />
                </Grid>
                <Grid item xs={6}>
                  <CardBadge badges={badges2} />
                </Grid>
                <Grid item xs={6}>
                  <CardTitle titles={titles1} />
                </Grid>
                <Grid item xs={6}>
                  <CardTitle titles={titles2} />
                </Grid>
                {themes.map((theme) => {
                  const score1 = scores1.find((el) => el.theme.id === theme.id);
                  const score2 = scores2.find((el) => el.theme.id === theme.id);
                  const rank1 = ranks1.find((el) => el.theme.id === theme.id);
                  const rank2 = ranks2.find((el) => el.theme.id === theme.id);
                  const opposition = oppositions.find(
                    (el) => el.theme === theme.id
                  );
                  const maxDuel = Math.max(
                    score1 ? score1.duelgames : 0,
                    score2 ? score2.duelgames : 0
                  );
                  const datasDuel = [
                    {
                      label: t("commun.games"),
                      value1: score1 ? score1.duelgames : 0,
                      value2: score2 ? score2.duelgames : 0,
                      max: maxDuel,
                    },
                    {
                      label: t("commun.victory"),
                      value1: score1 ? score1.victory : 0,
                      value2: score2 ? score2.victory : 0,
                      max: maxDuel,
                    },
                    {
                      label: t("commun.draw"),
                      value1: score1 ? score1.draw : 0,
                      value2: score2 ? score2.draw : 0,
                      max: maxDuel,
                    },
                    {
                      label: t("commun.defeat"),
                      value1: score1 ? score1.defeat : 0,
                      value2: score2 ? score2.defeat : 0,
                      max: maxDuel,
                    },
                    {
                      label: t("commun.points"),
                      value1: rank1 ? rank1.points : 0,
                      value2: rank2 ? rank2.points : 0,
                      max: Math.max(
                        rank1 ? rank1.points : 0,
                        rank2 ? rank2.points : 0
                      ),
                    },
                  ];

                  const datasSolo = [
                    {
                      label: t("commun.games"),
                      value1: score1 ? score1.games : 0,
                      value2: score2 ? score2.games : 0,
                      max: Math.max(
                        score1 ? score1.games : 0,
                        score2 ? score2.games : 0
                      ),
                    },
                    {
                      label: t("commun.bestscore"),
                      value1: score1 ? score1.points : 0,
                      value2: score2 ? score2.points : 0,
                      max: Math.max(
                        score1 ? score1.points : 0,
                        score2 ? score2.points : 0
                      ),
                    },
                  ];
                  return (
                    <Grid item xs={12} key={theme.id}>
                      <Paper
                        sx={{
                          overflow: "hidden",
                          backgroundColor: Colors.lightgrey,
                          height: percent(100),
                        }}
                      >
                        <Grid container>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                              backgroundColor: Colors.blue3,
                              p: px(5),
                            }}
                          >
                            <ImageThemeBlock theme={theme} size={40} />
                            <JsonLanguageBlock
                              variant="h2"
                              sx={{
                                wordWrap: "anywhere",
                                fontSize: 18,
                              }}
                              color="text.secondary"
                              value={theme.name}
                            />
                          </Grid>
                          <Grid item xs={12} sx={{ p: 1 }}>
                            <Grid
                              container
                              spacing={1}
                              alignItems="center"
                              justifyContent="center"
                            >
                              {opposition && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sx={{ textAlign: "center" }}
                                  >
                                    <Typography variant="h4">
                                      {t("commun.opposition")}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <BarVictory
                                      victory={opposition.victory}
                                      draw={opposition.draw}
                                      defeat={opposition.defeat}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Divider sx={{ borderBottomWidth: 3 }} />
                                  </Grid>
                                </>
                              )}
                              {((score1 && score1.duelgames > 0) ||
                                (score2 && score2.duelgames > 0)) && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sx={{ textAlign: "center" }}
                                  >
                                    <Typography variant="h4">
                                      {t("commun.duel")}
                                    </Typography>
                                  </Grid>
                                  {datasDuel.map((el, index) => (
                                    <Grid item xs={12} key={index}>
                                      <LineCompareTable value={el} />
                                    </Grid>
                                  ))}
                                  <Grid item xs={12}>
                                    <Divider sx={{ borderBottomWidth: 3 }} />
                                  </Grid>
                                </>
                              )}
                              <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <Typography variant="h4">
                                  {t("commun.solo")}
                                </Typography>
                              </Grid>
                              {datasSolo.map((el, index) => (
                                <Grid item xs={12} key={index}>
                                  <LineCompareTable value={el} />
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })}
              </>
            ) : (
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Alert severity="warning">{t("commun.select2player")}</Alert>
              </Grid>
            )}
            <SelectFriendModal
              open={openModalFriend1}
              close={() => setOpenModalFriend1(false)}
              onValid={(profile) => {
                setProfile1(profile);
                setOpenModalFriend1(false);
              }}
              withMe={true}
            />
            <SelectFriendModal
              open={openModalFriend2}
              close={() => setOpenModalFriend2(false)}
              onValid={(profile) => {
                setProfile2(profile);
                setOpenModalFriend2(false);
              }}
              withMe={true}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
