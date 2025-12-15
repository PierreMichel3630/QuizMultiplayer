import {
  Alert,
  Avatar,
  Box,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { AvatarAccount } from "../avatar/AvatarAccount";

import { percent, px } from "csx";
import moment from "moment";
import {
  Fragment,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  selectRankingDuelByThemeAndProfile,
  selectRankingDuelByThemePaginate,
  selectRankingSoloByThemeAndProfile,
  selectRankingSoloByThemePaginate,
} from "src/api/ranking";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Ranking } from "src/models/Ranking";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { isStringOrNumber } from "src/utils/type";
import { CountryImageBlock } from "../CountryBlock";
import { DefaultTabs } from "../Tabs";
import { ThemeBlock } from "../theme/ThemeBlock";
import { ProfileTitleBlock } from "../title/ProfileTitle";

export interface DataRanking {
  profile: Profile | null;
  value: number | string | JSX.Element;
  uuid?: string;
  extra?: string;
  date?: Date;
  theme?: Theme;
  size?: number;
  rank: number;
}
interface Props {
  data: Array<DataRanking>;
  loading?: boolean;
  navigation?: {
    link: string;
    label: string;
  };
  lastItemRef?: MutableRefObject<HTMLTableRowElement | null>;
}

export const RankingTable = ({
  data,
  navigation,
  loading = false,
  lastItemRef,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();
  const navigate = useNavigate();

  const idFriend = useMemo(
    () =>
      profile
        ? [
            ...friends
              .filter((el) => el.status === FRIENDSTATUS.VALID)
              .reduce(
                (acc, value) =>
                  value.user2.id === profile.id
                    ? [...acc, value.user1.id]
                    : [...acc, value.user2.id],
                [] as Array<string>
              ),
          ]
        : [],
    [friends, profile]
  );

  const getIcon = (rank: number) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey4, width: 25, height: 25 }}>
        <Typography variant="h6" color="text.secondary">
          {rank}
        </Typography>
      </Avatar>
    );
    switch (rank) {
      case 1:
        icon = <img alt="rank icon" src={rank1} width={30} loading="lazy" />;
        break;
      case 2:
        icon = <img alt="rank icon" src={rank2} width={30} loading="lazy" />;
        break;
      case 3:
        icon = <img alt="rank icon" src={rank3} width={30} loading="lazy" />;
        break;
    }
    return icon;
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {data.length === 0 && !loading ? (
        <Alert severity="warning" sx={{ width: percent(100) }}>
          {t("commun.noresultgame")}
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: Colors.grey,
            width: percent(100),
            borderTopLeftRadius: px(0),
            borderTopRightRadius: px(0),
          }}
          elevation={8}
        >
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableBody>
              {data.map((el, index) => {
                const isMe = profile && el.profile?.id === profile.id;
                const isFriend = el.profile
                  ? idFriend.includes(el.profile.id)
                  : false;
                const colorFriend = isFriend ? Colors.purple : "initial";
                const color = isMe ? Colors.colorApp : colorFriend;

                return (
                  <Fragment key={index}>
                    <TableRow
                      sx={{
                        backgroundColor: color,
                      }}
                      ref={index === data.length - 1 ? lastItemRef : null}
                    >
                      <TableCell align="left" sx={{ p: px(4), width: px(40) }}>
                        {getIcon(el.rank)}
                      </TableCell>
                      <TableCell sx={{ p: px(4), width: px(50) }}>
                        {el.profile ? (
                          <Link
                            to={`/profil/${el.profile.id}`}
                            style={{ textDecoration: "inherit" }}
                          >
                            <AvatarAccount
                              avatar={el.profile.avatar.icon}
                              size={40}
                            />
                          </Link>
                        ) : (
                          <Avatar sx={{ bgcolor: Colors.black }}>I</Avatar>
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          p: px(4),
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: px(4),
                          }}
                        >
                          {el.profile ? (
                            <>
                              <Link
                                to={`/profil/${el.profile.id}`}
                                style={{
                                  textDecoration: "inherit",
                                  display: "flex",
                                  gap: px(8),
                                  alignItems: "center",
                                }}
                              >
                                {el.profile.country && (
                                  <CountryImageBlock
                                    country={el.profile.country}
                                  />
                                )}
                                <Typography variant="h6" noWrap>
                                  {el.profile.username}
                                </Typography>
                              </Link>
                              <ProfileTitleBlock
                                titleprofile={el.profile.titleprofile}
                              />
                            </>
                          ) : (
                            <Typography variant="h6" noWrap>
                              {t("commun.notconnect")}
                            </Typography>
                          )}
                          {el.date && (
                            <Typography variant="caption">
                              {moment(el.date).format("DD/MM/YYYY HH:mm")}
                            </Typography>
                          )}
                          {el.theme && (
                            <Link
                              to={`/theme/${el.theme.id}`}
                              style={{ textDecoration: "inherit" }}
                            >
                              <ThemeBlock theme={el.theme} />
                            </Link>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          p: px(4),
                        }}
                        width={el.size ?? 90}
                      >
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          {isStringOrNumber(el.value) ? (
                            <Typography variant="h2" component="span" noWrap>
                              {el.value}
                            </Typography>
                          ) : (
                            el.value
                          )}

                          {el.extra && (
                            <Typography variant="body1" component="span">
                              {el.extra}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
              {loading &&
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ p: px(4), width: px(40) }}>
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                    <TableCell align="left" sx={{ p: px(4), width: px(50) }}>
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                    <TableCell align="left" sx={{ p: px(4) }}>
                      <Skeleton variant="rectangular" width={100} height={20} />
                    </TableCell>
                    <TableCell align="right" sx={{ p: px(4), width: px(60) }}>
                      <Skeleton variant="rectangular" width={40} height={25} />
                    </TableCell>
                  </TableRow>
                ))}
              {navigation && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ p: px(2) }}>
                    <Button
                      variant="outlined"
                      sx={{
                        minWidth: "auto",
                        textTransform: "uppercase",
                        "&:hover": {
                          border: "2px solid currentColor",
                        },
                      }}
                      color="secondary"
                      size="small"
                      fullWidth
                      onClick={() => navigate(navigation.link)}
                    >
                      <Typography variant="h6" noWrap>
                        {navigation.label}
                      </Typography>
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

interface PropsSoloDuel {
  theme?: Theme;
  max?: number;
  mode?: "ALL" | "DUEL" | "SOLO";
}

export const RankingTableSoloDuel = ({
  theme,
  max = 5,
  mode = "ALL",
}: PropsSoloDuel) => {
  const { t } = useTranslation();
  const { friends } = useApp();
  const { profile } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(mode === "DUEL" ? 1 : 0);
  const tabs = useMemo(
    () =>
      mode === "ALL"
        ? [{ label: t("commun.solo") }, { label: t("commun.duel") }]
        : [],
    [mode, t]
  );
  const [data, setData] = useState<Array<DataRanking>>([]);

  const idProfile = useMemo(
    () =>
      profile
        ? [
            profile.id,
            ...friends
              .filter((el) => el.status === FRIENDSTATUS.VALID)
              .reduce(
                (acc, value) =>
                  value.user2.id === profile.id
                    ? [...acc, value.user1.id]
                    : [...acc, value.user2.id],
                [] as Array<string>
              ),
          ]
        : [],
    [friends, profile]
  );

  useEffect(() => {
    setTab(mode === "DUEL" ? 1 : 0);
  }, [mode]);

  useEffect(() => {
    setIsLoading(true);
    if (theme) {
      if (tab === 0) {
        selectRankingSoloByThemeAndProfile(theme.id, idProfile, max).then(
          (res) => {
            const ranking = res.data as Array<Ranking>;
            const newData = ranking.map((el) => ({
              profile: el.profile,
              value: el.points,
              uuid: el.uuidgame !== null ? el.uuidgame.uuid : undefined,
              extra: t("commun.pointsabbreviation"),
              rank: el.ranking,
            })) as Array<DataRanking>;
            setData(newData);
            setIsLoading(false);
          }
        );
      } else {
        selectRankingDuelByThemeAndProfile(theme.id, idProfile, max).then(
          (res) => {
            const ranking = res.data as Array<Ranking>;
            const newData = ranking.map((el) => ({
              profile: el.profile,
              value: el.rank,
              rank: el.ranking,
            })) as Array<DataRanking>;
            setData(newData);
            setIsLoading(false);
          }
        );
      }
    }
  }, [theme, tab, t, idProfile, max]);

  return (
    <Box sx={{ p: 1 }}>
      {tabs.length > 1 && (
        <DefaultTabs
          values={tabs}
          tab={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      )}
      <RankingTable data={data} loading={isLoading} />
    </Box>
  );
};

interface PropsSoloDuel {
  theme?: Theme;
  mode?: "ALL" | "DUEL" | "SOLO";
}

export const RankingTableSoloDuelPaginate = ({
  theme,
  mode = "ALL",
}: PropsSoloDuel) => {
  const { t } = useTranslation();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const ITEMPERPAGE = 30;

  const [tab, setTab] = useState(mode === "DUEL" ? 1 : 0);
  const tabs = useMemo(
    () =>
      mode === "ALL"
        ? [{ label: t("commun.solo") }, { label: t("commun.duel") }]
        : [],
    [mode, t]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [data, setData] = useState<Array<DataRanking>>([]);

  const getRankingDuel = useCallback(
    (page: number) => {
      if (isLoading) return;
      if (theme && (page === 0 || !isEnd)) {
        setIsLoading(true);
        selectRankingDuelByThemePaginate(theme.id, page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data as Array<Ranking>;
            const newData = result.map((el) => ({
              profile: el.profile,
              value: el.rank,
              rank: el.ranking,
              size: 70,
            })) as Array<DataRanking>;
            setIsEnd(result.length < ITEMPERPAGE);
            setData((prev) =>
              page === 0 ? [...newData] : [...prev, ...newData]
            );
            setIsLoading(false);
          }
        );
      }
    },
    [isEnd, theme, isLoading]
  );

  const getRankingSolo = useCallback(
    (page: number) => {
      if (isLoading) return;
      const itemperpage = 30;
      if (theme && (page === 0 || !isEnd)) {
        setIsLoading(true);
        selectRankingSoloByThemePaginate(theme.id, page, itemperpage).then(
          ({ data }) => {
            const result = data as Array<Ranking>;
            const newData = result.map((el) => ({
              profile: el.profile,
              value: el.points,
              uuid: el.uuidgame !== null ? el.uuidgame.uuid : undefined,
              extra: t("commun.pointsabbreviation"),
              rank: el.ranking,
              size: 70,
            })) as Array<DataRanking>;
            setIsEnd(result.length < itemperpage);
            setData((prev) =>
              page === 0 ? [...newData] : [...prev, ...newData]
            );
            setIsLoading(false);
          }
        );
      }
    },
    [isLoading, theme, isEnd, t]
  );

  useEffect(() => {
    setTab(mode === "DUEL" ? 1 : 0);
  }, [mode]);

  useEffect(() => {
    setPage(0);
    setData([]);
    setIsEnd(false);
    if (tab === 1) {
      getRankingDuel(0);
    } else {
      getRankingSolo(0);
    }
  }, [tab, theme]);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          if (tab === 1) {
            getRankingDuel(prev + 1);
          } else {
            getRankingSolo(prev + 1);
          }
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [data, isLoading, isEnd, getRankingDuel, getRankingSolo, tab]);

  return (
    <Box sx={{ p: 1 }}>
      {tabs.length > 1 && (
        <DefaultTabs
          values={tabs}
          tab={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      )}
      <RankingTable data={data} loading={isLoading} lastItemRef={lastItemRef} />
    </Box>
  );
};
