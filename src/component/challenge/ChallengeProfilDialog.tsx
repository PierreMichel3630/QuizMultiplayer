import {
  Divider,
  Grid
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  selectChallengeAllTimeByProfile,
  selectChallengeGameByProfileId,
  selectRankingChallengeMonthByProfileId,
  selectRankingChallengeWeekByProfileId,
} from "src/api/challenge";
import { getProfilById } from "src/api/profile";
import {
  ChallengeRankingAllTime,
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { ClassementChallengeTimeListEnum } from "src/models/enum/ClassementEnum";
import { Profile } from "src/models/Profile";
import { GroupButtonChallengeTime } from "../button/ButtonGroup";
import {
  CardChallengeAllTime,
  CardChallengeDay,
  CardChallengeMonth,
  CardChallengeWeek,
} from "../card/CardChallenge";
import { BaseRecapDialog } from "../modal/commun/BaseRecapDialog";
import { SkeletonChallenges } from "../skeleton/SkeletonChallenge";
import { RatingChallenge } from "./RatingChallenge";

export interface Props {
  profileId?: string;
  open: boolean;
  close: () => void;
}

export const ChallengeProfilDialog = ({ profileId, open, close }: Props) => {

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
    if (profileId) {
      selectChallengeAllTimeByProfile(profileId).then(({ data }) => {
        const values: Array<ChallengeRankingAllTime> = data.data;
        setStatAllTime(values[0] ?? null);
      });
      getProfilById(profileId).then(({ data }) => {
        setProfile(data);
      });
    }
  }, [profileId]);

  useEffect(() => {
    if (!profileId) return;

    setPage(0);
    setHasMore(true);
    fetchData(0);
  }, [tabTime, profileId]);

  const fetchData = async (pageToFetch = page) => {
    if (loading) return;
    if (profileId) {
      setLoading(true);
      if (tabTime === ClassementChallengeTimeListEnum.day) {
        selectChallengeGameByProfileId(
          profileId,
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
          profileId,
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
          profileId,
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
    if (profileId) {
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
  }, [loading, hasMore, profileId]);

  return (
    <BaseRecapDialog open={open} close={close} profile={profile}>
      {profile && (
        <Grid container spacing={2}>
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
    </BaseRecapDialog>
  );
};
