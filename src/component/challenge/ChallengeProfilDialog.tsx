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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  selectChallengeGameByProfileId,
  selectRankingChallengeAllTimeByProfileId,
  selectRankingChallengeMonthByProfileId,
  selectRankingChallengeWeekByProfileId,
} from "src/api/challenge";
import {
  ChallengeRankingAllTime,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek
} from "src/models/Challenge";
import {
  ClassementChallengeTimeListEnum
} from "src/models/enum/ClassementEnum";
import { GroupButtonChallengeTime } from "../button/ButtonGroup";
import {
  CardChallengeAllTime,
  CardChallengeDay,
  CardChallengeMonth,
  CardChallengeWeek,
} from "../card/CardChallenge";
import { ProfileBlock } from "../profile/ProfileBlock";
import { SkeletonChallenges } from "../skeleton/SkeletonChallenge";
import { DataRankingChallenge } from "../table/RankingChallengeTable";
import { RatingChallenge } from "./RatingChallenge";

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

  const [tabTime, setTabTime] = useState(ClassementChallengeTimeListEnum.day);
  const [statDay, setStatDay] = useState<Array<ChallengeRankingDay>>([]);
  const [statMonth, setStatMonth] = useState<Array<ChallengeRankingMonth>>([]);
  const [statWeek, setStatWeek] = useState<Array<ChallengeRankingWeek>>([]);
  const [statAllTime, setStatAllTime] =
    useState<null | ChallengeRankingAllTime>(null);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setStatDay([]);
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
    if (!data) return;

    setPage(0);
    setHasMore(true);
    fetchData(0);
  }, [tabTime, data]);

  const fetchData = async (pageToFetch = page) => {
    if (loading) return;
    if (data) {
      setLoading(true);
      const profile = data.profile;
      if (tabTime === ClassementChallengeTimeListEnum.day) {
        selectChallengeGameByProfileId(
          profile.id,
          pageToFetch,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          if (pageToFetch === 0) {
            setStatDay(data ?? []);
            setPage(1);
          } else {
            setStatDay((prev) => [...prev, ...(data ?? [])]);
            setPage((prev) => prev + 1);
          }

          if (!data || data.length === 0) {
            setHasMore(false);
          }
          setPage((prev) => prev + 1);
          setLoading(false);
        });
      } else if (tabTime === ClassementChallengeTimeListEnum.week) {
        setLoading(true);
        selectRankingChallengeWeekByProfileId(
          profile.id,
          pageToFetch,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          if (pageToFetch === 0) {
            setStatWeek(data ?? []);
            setPage(1);
          } else {
            setStatWeek((prev) => [...prev, ...(data ?? [])]);
            setPage((prev) => prev + 1);
          }

          if (!data || data.length === 0) {
            setHasMore(false);
          }
          setLoading(false);
        });
      } else if (tabTime === ClassementChallengeTimeListEnum.month) {
        setLoading(true);
        selectRankingChallengeMonthByProfileId(
          profile.id,
          pageToFetch,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          if (pageToFetch === 0) {
            setStatMonth(data ?? []);
            setPage(1);
          } else {
            setStatMonth((prev) => [...prev, ...(data ?? [])]);
            setPage((prev) => prev + 1);
          }

          if (!data || data.length === 0) {
            setHasMore(false);
          }
          setLoading(false);
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      const observer = new IntersectionObserver(
        (entries) => {
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
  }, [loading, hasMore, data]);

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
                type={ClassementChallengeTimeListEnum}
                selected={tabTime}
                onChange={(value) => {
                  setTabTime(value as ClassementChallengeTimeListEnum);
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
                    {statDay.map((stat , index) => (
                      <Grid key={index} size={12}>
                        <CardChallengeDay value={stat} />
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
              }[tabTime]
            }
            <Grid size={12} ref={loaderRef} />
            {hasMore && <SkeletonChallenges number={2} />}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
