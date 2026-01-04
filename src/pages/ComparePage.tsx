import { Alert, Box, Grid } from "@mui/material";
import { percent, px } from "csx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { selectBadgeByProfile } from "src/api/badge";
import { getComparePlayers } from "src/api/compare";
import { selectTitleByProfile } from "src/api/title";
import { BasicSearchInput } from "src/component/Input";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { SortButton } from "src/component/SortBlock";
import { CardBadge } from "src/component/card/CardBadge";
import { CardCompare } from "src/component/card/CardCompare";
import { CardTitle } from "src/component/card/CardTitle";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { SkeletonRectangulars } from "src/component/skeleton/SkeletonRectangular";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Badge, BadgeProfile } from "src/models/Badge";
import { ComparePlayers } from "src/models/Compare";
import { Profile } from "src/models/Profile";
import { TitleProfile } from "src/models/Title";

export default function ComparePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { headerSize } = useApp();
  const { language } = useUser();

  const [profile1, setProfile1] = useState<Profile | undefined>(
    location.state ? location.state.profile1 : undefined
  );
  const [titles1, setTitles1] = useState<Array<TitleProfile>>([]);
  const [badges1, setBadges1] = useState<Array<Badge>>([]);
  const [openModalFriend1, setOpenModalFriend1] = useState(false);

  const [profile2, setProfile2] = useState<Profile | undefined>(
    location.state ? location.state.profile2 : undefined
  );
  const [titles2, setTitles2] = useState<Array<TitleProfile>>([]);
  const [badges2, setBadges2] = useState<Array<Badge>>([]);
  const [openModalFriend2, setOpenModalFriend2] = useState(false);
  const [values, setValues] = useState<Array<ComparePlayers>>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("alphabetical");

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

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

  const getTitles = (
    uuid: string,
    set: (value: Array<TitleProfile>) => void
  ) => {
    selectTitleByProfile(uuid).then(({ data }) => {
      set(data ?? []);
    });
  };

  useEffect(() => {
    if (profile1) {
      getTitles(profile1.id, setTitles1);
      getBadges(profile1.id, setBadges1);
    }
  }, [profile1]);

  useEffect(() => {
    if (profile2) {
      getTitles(profile2.id, setTitles2);
      getBadges(profile2.id, setBadges2);
    }
  }, [profile2]);

  const getScore = useCallback(
    (page: number) => {
      const itemperpage = 10;
      if (loading) return;
      setLoading(true);
      if (profile1 && profile2 && language) {
        getComparePlayers(
          profile1.id,
          profile2.id,
          search,
          language.id,
          sort,
          page
        ).then(({ data }) => {
          const result = data ?? [];
          setIsEnd(result.length < itemperpage);
          setValues((prev) =>
            page === 0 ? [...result] : [...prev, ...result]
          );
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    },
    [language, loading, profile1, profile2, search, sort]
  );

  useEffect(() => {
    setPage(0);
    setValues([]);
    setIsEnd(false);
    getScore(0);
  }, [search, profile1, profile2, sort, language]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getScore(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [values, loading, isEnd, getScore]);

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.compare.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid size={6}>
              <SelectorProfileBlock
                label={t("commun.selectplayer")}
                profile={profile1}
                onChange={() => setOpenModalFriend1(true)}
              />
            </Grid>
            <Grid size={6}>
              <SelectorProfileBlock
                label={t("commun.selectplayer")}
                profile={profile2}
                onChange={() => setOpenModalFriend2(true)}
              />
            </Grid>
            {profile1 && profile2 && (
              <>
                <Grid size={6}>
                  <CardBadge badges={badges1} />
                </Grid>
                <Grid size={6}>
                  <CardBadge badges={badges2} />
                </Grid>
                <Grid size={6}>
                  <CardTitle titles={titles1} />
                </Grid>
                <Grid size={6}>
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
                  {values.map((value, index) => (
                    <Grid
                      key={index}
                      ref={index === values.length - 1 ? lastItemRef : null}
                      size={12}>
                      <CardCompare value={value} />
                    </Grid>
                  ))}
                  {!isEnd && <SkeletonRectangulars number={10} />}
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
