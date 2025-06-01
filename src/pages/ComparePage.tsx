import { Alert, Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { selectBadgeByProfile } from "src/api/badge";
import {
  selectOppositionByOpponent,
  selectScoresByProfile,
} from "src/api/score";
import { selectTitleByProfile } from "src/api/title";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { BasicSearchInput } from "src/component/Input";
import { LineCompareTable } from "src/component/LineCompareTable";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { SortButton } from "src/component/SortBlock";
import { CardBadge } from "src/component/card/CardBadge";
import { CardTitle } from "src/component/card/CardTitle";
import { BarVictory } from "src/component/chart/BarVictory";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Badge, BadgeProfile } from "src/models/Badge";
import { Profile } from "src/models/Profile";
import { Opposition, Score } from "src/models/Score";
import { Title, TitleProfile } from "src/models/Title";
import { Colors } from "src/style/Colors";
import {
  sortByDuelGamesDesc,
  sortByDuelGamesScore1Or2Desc,
  sortByGamesScore1Or2Desc,
  sortByName,
  sortByPointsGamesScore1Or2Desc,
  sortByRankGamesScore1Or2Desc,
} from "src/utils/sort";
import { searchString } from "src/utils/string";

export default function ComparePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const location = useLocation();
  const { headerSize } = useApp();

  const [profile1, setProfile1] = useState<Profile | undefined>(
    location.state ? location.state.profile1 : undefined
  );
  const [titles1, setTitles1] = useState<Array<Title>>([]);
  const [badges1, setBadges1] = useState<Array<Badge>>([]);
  const [scores1, setScores1] = useState<Array<Score>>([]);
  const [openModalFriend1, setOpenModalFriend1] = useState(false);

  const [profile2, setProfile2] = useState<Profile | undefined>(
    location.state ? location.state.profile2 : undefined
  );
  const [titles2, setTitles2] = useState<Array<Title>>([]);
  const [badges2, setBadges2] = useState<Array<Badge>>([]);
  const [scores2, setScores2] = useState<Array<Score>>([]);
  const [openModalFriend2, setOpenModalFriend2] = useState(false);

  const [oppositions, setOppositions] = useState<Array<Opposition>>([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("alphabetical");

  const sorts = [
    { value: "alphabetical", label: t("sort.alphabetical"), sort: setSort },
    { value: "gamessolo", label: t("sort.gamessolo"), sort: setSort },
    { value: "gamesduel", label: t("sort.gamesduel"), sort: setSort },
    { value: "scoresolo", label: t("sort.scoresolo"), sort: setSort },
    { value: "scoreduel", label: t("sort.scoreduel"), sort: setSort },
  ];

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
      set([...res].sort(sortByDuelGamesDesc));
    });
  };

  useEffect(() => {
    if (profile1) {
      getTitles(profile1.id, setTitles1);
      getBadges(profile1.id, setBadges1);
      getScore(profile1.id, setScores1);
    }
  }, [profile1]);

  useEffect(() => {
    if (profile2) {
      getTitles(profile2.id, setTitles2);
      getBadges(profile2.id, setBadges2);
      getScore(profile2.id, setScores2);
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

  const themesWithScoreAndRank = useMemo(() => {
    const allthemes = uniqBy(
      [...scores1.map((el) => el.theme), ...scores2.map((el) => el.theme)],
      (el) => el.id
    );
    const result = allthemes.map((theme) => {
      const score1 = scores1.find((el) => el.theme.id === theme.id);
      const score2 = scores2.find((el) => el.theme.id === theme.id);
      const opposition = oppositions.find((el) => el.theme === theme.id);

      return { ...theme, score1, score2, opposition };
    });
    return result;
  }, [oppositions, scores1, scores2]);

  const themesDisplay = useMemo(() => {
    let res = [...themesWithScoreAndRank].filter((el) =>
      searchString(search, el.title)
    );
    switch (sort) {
      case "alphabetical":
        res = [...res].sort((a, b) => sortByName(language, a, b));
        break;
      case "gamessolo":
        res = [...res].sort(sortByGamesScore1Or2Desc);
        break;
      case "gamesduel":
        res = [...res].sort(sortByDuelGamesScore1Or2Desc);
        break;
      case "scoresolo":
        res = [...res].sort(sortByPointsGamesScore1Or2Desc);
        break;
      case "scoreduel":
        res = [...res].sort(sortByRankGamesScore1Or2Desc);
        break;
      default:
        res = [...res].sort((a, b) => sortByName(language, a, b));
        break;
    }

    return res;
  }, [themesWithScoreAndRank, search, language, sort]);

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.compare.title")} - ${t("appname")}`}</title>
      </Helmet>
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
            {profile1 && profile2 && (
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
              </>
            )}
          </Grid>
        </Box>
        <Box>
          {profile1 && profile2 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: px(5),
                  p: 1,
                  position: "sticky",
                  top: headerSize,
                  backgroundColor: "background.paper",
                  width: percent(100),
                }}
              >
                <BasicSearchInput
                  label={t("commun.searchtheme")}
                  onChange={(value) => setSearch(value)}
                  value={search}
                  clear={() => setSearch("")}
                />
                <SortButton menus={sorts} />
              </Box>
              <Box sx={{ p: 1 }}>
                <Grid container spacing={1}>
                  {themesDisplay.map((theme) => {
                    const maxDuel = Math.max(
                      theme.score1 ? theme.score1.duelgames : 0,
                      theme.score2 ? theme.score2.duelgames : 0
                    );
                    const datasDuel = [
                      {
                        label: t("commun.games"),
                        value1: theme.score1 ? theme.score1.duelgames : 0,
                        value2: theme.score2 ? theme.score2.duelgames : 0,
                        max: maxDuel,
                      },
                      {
                        label: t("commun.victory"),
                        value1: theme.score1 ? theme.score1.victory : 0,
                        value2: theme.score2 ? theme.score2.victory : 0,
                        max: maxDuel,
                      },
                      {
                        label: t("commun.draw"),
                        value1: theme.score1 ? theme.score1.draw : 0,
                        value2: theme.score2 ? theme.score2.draw : 0,
                        max: maxDuel,
                      },
                      {
                        label: t("commun.defeat"),
                        value1: theme.score1 ? theme.score1.defeat : 0,
                        value2: theme.score2 ? theme.score2.defeat : 0,
                        max: maxDuel,
                      },
                      {
                        label: t("commun.points"),
                        value1: theme.score1 ? theme.score1.rank : 0,
                        value2: theme.score2 ? theme.score2.rank : 0,
                        max: Math.max(
                          theme.score1 ? theme.score1.rank : 0,
                          theme.score2 ? theme.score2.rank : 0
                        ),
                      },
                    ];

                    const datasSolo = [
                      {
                        label: t("commun.games"),
                        value1: theme.score1 ? theme.score1.games : 0,
                        value2: theme.score2 ? theme.score2.games : 0,
                        max: Math.max(
                          theme.score1 ? theme.score1.games : 0,
                          theme.score2 ? theme.score2.games : 0
                        ),
                      },
                      {
                        label: t("commun.bestscore"),
                        value1: theme.score1 ? theme.score1.points : 0,
                        value2: theme.score2 ? theme.score2.points : 0,
                        max: Math.max(
                          theme.score1 ? theme.score1.points : 0,
                          theme.score2 ? theme.score2.points : 0
                        ),
                      },
                    ];
                    return (
                      <Grid item xs={12} key={theme.id}>
                        <Paper
                          sx={{
                            overflow: "hidden",
                            backgroundColor: Colors.grey,
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
                                backgroundColor: Colors.colorApp,
                                p: px(5),
                              }}
                            >
                              <ImageThemeBlock theme={theme} size={40} />
                              <Typography
                                variant="h2"
                                sx={{
                                  wordWrap: "anywhere",
                                  fontSize: 18,
                                }}
                                color="text.secondary"
                              >
                                {theme.title}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ p: 1 }}>
                              <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                justifyContent="center"
                              >
                                {theme.opposition && (
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
                                        victory={theme.opposition.victory}
                                        draw={theme.opposition.draw}
                                        defeat={theme.opposition.defeat}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Divider sx={{ borderBottomWidth: 3 }} />
                                    </Grid>
                                  </>
                                )}
                                {((theme.score1 &&
                                  theme.score1.duelgames > 0) ||
                                  (theme.score2 &&
                                    theme.score2.duelgames > 0)) && (
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
                                {((theme.score1 && theme.score1.games > 0) ||
                                  (theme.score2 && theme.score2.games > 0)) && (
                                  <>
                                    <Grid
                                      item
                                      xs={12}
                                      sx={{ textAlign: "center" }}
                                    >
                                      <Typography variant="h4">
                                        {t("commun.solo")}
                                      </Typography>
                                    </Grid>
                                    {datasSolo.map((el, index) => (
                                      <Grid item xs={12} key={index}>
                                        <LineCompareTable value={el} />
                                      </Grid>
                                    ))}
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </>
          ) : (
            <Box sx={{ p: 1 }}>
              <Alert severity="warning">{t("commun.select2player")}</Alert>
            </Box>
          )}
        </Box>
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
    </Grid>
  );
}
