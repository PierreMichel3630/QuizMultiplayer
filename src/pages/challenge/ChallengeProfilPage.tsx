import { Box, Container, Divider, Grid } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  selectChallengeAllTimeByProfile,
  selectChallengeGameByProfileId,
  selectRankingChallengeMonthByProfileId,
  selectRankingChallengeWeekByProfileId,
} from "src/api/challenge";
import { selectProfilById } from "src/api/profile";
import { GroupButtonChallengeTime } from "src/component/button/ButtonGroup";
import {
  CardChallengeAllTime,
  CardChallengeDay,
  CardChallengeMonth,
  CardChallengeWeek,
} from "src/component/card/CardChallenge";
import { RatingChallenge } from "src/component/challenge/RatingChallenge";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { SkeletonChallenges } from "src/component/skeleton/SkeletonChallenge";
import {
  ChallengeRankingAllTime,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { ClassementChallengeTimeListEnum } from "src/models/enum/ClassementEnum";
import { Profile } from "src/models/Profile";

export const ChallengeProfilPage = () => {
  const { uuid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ITEM_PER_PAGE = 20;
  const loaderRef = useRef(null);

  const [profile, setProfile] = useState<Profile | undefined>(undefined);
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
    if (uuid) {
      selectChallengeAllTimeByProfile(uuid).then(({ data }) => {
        const values: Array<ChallengeRankingAllTime> = data.data;
        setStatAllTime(values[0] ?? null);
      });
      selectProfilById(uuid).then(({ data }) => {
        setProfile(data);
      });
    }
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;

    setPage(0);
    setHasMore(true);
    fetchData(0);
  }, [tabTime, uuid]);

  const fetchData = async (pageToFetch = page) => {
    if (loading) return;
    if (uuid) {
      setLoading(true);
      if (tabTime === ClassementChallengeTimeListEnum.day) {
        selectChallengeGameByProfileId(uuid, pageToFetch, ITEM_PER_PAGE).then(
          ({ data }) => {
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
          },
        );
      } else if (tabTime === ClassementChallengeTimeListEnum.week) {
        setLoading(true);
        selectRankingChallengeWeekByProfileId(
          uuid,
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
          uuid,
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
    if (uuid) {
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
  }, [loading, hasMore, uuid]);

  return (
    <Grid container className="page" alignContent="flex-start">
      <Helmet>
        <title>{`${t("pages.challenge.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation
        title={t("pages.challenge.title")}
        quit={() => navigate(-1)}
      />
      <Grid size={12}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {profile && (
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Link
                    to={`/profil/${profile.id}`}
                    style={{ textDecoration: "none", width: percent(100) }}
                  >
                    <ProfileBlock profile={profile} />
                  </Link>
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
                          <RatingChallenge profile={profile} />
                        </Grid>
                        <Grid size={12}>
                          <Divider sx={{ borderBottomWidth: 5 }} />
                        </Grid>
                        {statDay.map((stat, index) => (
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
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};
