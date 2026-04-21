import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataRankingChallenge } from "../table/RankingChallengeTable";
import { ProfileBlock } from "../profile/ProfileBlock";
import { GroupButtonChallengeTime } from "../button/ButtonGroup";
import { ClassementChallengeTimeEnum } from "src/models/enum/ClassementEnum";
import { useEffect, useRef, useState } from "react";
import { RatingChallenge } from "./RatingChallenge";
import {
  ChallengeRanking,
  ChallengeRankingAllTime,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { CardChallengeGame } from "../card/CardChallengeGame";
import {
  CardChallengeWeek,
  CardChallengeMonth,
  CardChallengeAllTime,
} from "../card/CardChallenge";
import {
  selectChallengeGameByProfileId,
  selectRankingChallengeMonthByProfileId,
  selectRankingChallengeWeekByProfileId,
  selectRankingChallengeAllTimeByProfileId,
} from "src/api/challenge";

export interface Props {
  data?: DataRankingChallenge;
  open: boolean;
  close: () => void;
}

export const ChallengeProfilDialog = ({ data, open, close }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const ITEM_PER_PAGE = 20;
  const loaderRef = useRef(null);

  const [tabTime, setTabTime] = useState(ClassementChallengeTimeEnum.day);
  const [games, setGames] = useState<Array<ChallengeRanking>>([]);
  const [statMonth, setStatMonth] = useState<Array<ChallengeRankingMonth>>([]);
  const [statWeek, setStatWeek] = useState<Array<ChallengeRankingWeek>>([]);
  const [statAllTime, setStatAllTime] =
    useState<null | ChallengeRankingAllTime>(null);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setGames([]);
    setStatMonth([]);
    setStatWeek([]);
    setStatAllTime(null);
    if (data) {
      const profile = data.profile;
      selectRankingChallengeAllTimeByProfileId(profile.id).then(({ data }) => {
        setStatAllTime(data);
      });
    }
  }, [data]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchData();
  }, [tabTime]);

  /*useEffect(() => {
    if (!data) return;
    const profile = data.profile;

    if (tabTime === ClassementChallengeTimeEnum.day) {
      setLoading(true);

      selectChallengeGameByProfileId(profile.id, page, ITEM_PER_PAGE).then(
        ({ data }) => {
          if (page === 0) {
            setGames(data ?? []);
          } else {
            setGames((prev) => [...prev, ...(data ?? [])]);
          }

          if (!data || data.length === 0) {
            setHasMore(false);
          }
        },
      );
    } else if (tabTime === ClassementChallengeTimeEnum.week) {
      setLoading(true);
      selectRankingChallengeWeekByProfileId(
        profile.id,
        page,
        ITEM_PER_PAGE,
      ).then(({ data }) => {
        setStatWeek(data ?? []);
      });
    } else if (tabTime === ClassementChallengeTimeEnum.month) {
      setLoading(true);
      selectRankingChallengeMonthByProfileId(
        profile.id,
        page,
        ITEM_PER_PAGE,
      ).then(({ data }) => {
        setStatMonth(data ?? []);
      });
    } else if (tabTime === ClassementChallengeTimeEnum.alltime) {
      setLoading(true);
      selectRankingChallengeAllTimeByProfileId(profile.id).then(({ data }) => {
        setStatAllTime(data);
      });
    }
  }, [tabTime, data, page]);*/

  const fetchData = async () => {
    console.log("fetchData");
    if (loading) return;
    if (data) {
      setLoading(true);
      const profile = data.profile;
      if (tabTime === ClassementChallengeTimeEnum.day) {
        selectChallengeGameByProfileId(profile.id, page, ITEM_PER_PAGE).then(
          ({ data }) => {
            if (page === 0) {
              setGames(data ?? []);
            } else {
              setGames((prev) => [...prev, ...(data ?? [])]);
            }

            if (!data || data.length === 0) {
              setHasMore(false);
            }
            setPage((prev) => prev + 1);
            setLoading(false);
          },
        );
      } else if (tabTime === ClassementChallengeTimeEnum.week) {
        setLoading(true);
        selectRankingChallengeWeekByProfileId(
          profile.id,
          page,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          if (page === 0) {
            setStatWeek(data ?? []);
          } else {
            setStatWeek((prev) => [...prev, ...(data ?? [])]);
          }

          if (!data || data.length === 0) {
            setHasMore(false);
          }
          setPage((prev) => prev + 1);
          setLoading(false);
        });
      } else if (tabTime === ClassementChallengeTimeEnum.month) {
        setLoading(true);
        selectRankingChallengeMonthByProfileId(
          profile.id,
          page,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          if (page === 0) {
            setStatMonth(data ?? []);
          } else {
            setStatMonth((prev) => [...prev, ...(data ?? [])]);
          }

          if (!data || data.length === 0) {
            setHasMore(false);
          }
          setPage((prev) => prev + 1);
          setLoading(false);
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      const observer = new IntersectionObserver(
        (entries) => {
          console.log(entries);
          if (entries[0].isIntersecting && hasMore) {
            fetchData();
          }
        },
        {
          root: null,
          rootMargin: "200px", // preload avant d’atteindre le bas
          threshold: 0,
        },
      );

      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }

      return () => observer.disconnect();
    }
  }, [page, loading, hasMore, data]);

  return (
    <Dialog onClose={close} open={open} maxWidth="md" fullScreen={fullScreen}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.result")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {data && (
          <Grid container spacing={2}>
            <Grid size={12}>
              <ProfileBlock profile={data.profile} />
            </Grid>
            {statAllTime && (
              <Grid size={12}>
                <CardChallengeAllTime value={statAllTime} />
              </Grid>
            )}
            <Grid size={12}>
              <GroupButtonChallengeTime
                selected={tabTime}
                onChange={(value) => {
                  setTabTime(value);
                }}
              />
            </Grid>
            {
              {
                day: (
                  <>
                    <Grid size={12}>
                      <RatingChallenge profile={data.profile} />
                    </Grid>
                    <Grid size={12}>
                      <Divider sx={{ borderBottomWidth: 5 }} />
                    </Grid>
                    {games.map((game) => (
                      <Grid key={game.id} size={12}>
                        <CardChallengeGame game={game} />
                      </Grid>
                    ))}
                  </>
                ),
                week: (
                  <>
                    {statWeek.map((stat, index) => (
                      <Grid key={index} size={12}>
                        <CardChallengeWeek value={stat} />
                      </Grid>
                    ))}
                  </>
                ),
                month: (
                  <>
                    {statMonth.map((stat, index) => (
                      <Grid key={index} size={12}>
                        <CardChallengeMonth value={stat} />
                      </Grid>
                    ))}
                  </>
                ),
                alltime: (
                  <>
                    {statAllTime && (
                      <Grid size={12}>
                        <CardChallengeAllTime value={statAllTime} />
                      </Grid>
                    )}
                  </>
                ),
              }[tabTime]
            }
            <Grid size={12} ref={loaderRef}>
              {loading && <p>Chargement...</p>}
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
