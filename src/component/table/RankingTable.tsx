import {
  Alert,
  Avatar,
  Box,
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

import VisibilityIcon from "@mui/icons-material/Visibility";
import { percent, px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { useTranslation } from "react-i18next";
import { DefaultTabs } from "../Tabs";
import {
  selectRankingDuelByTheme,
  selectRankingSoloByTheme,
} from "src/api/ranking";
import { Ranking } from "src/models/Ranking";
import moment from "moment";
import { useApp } from "src/context/AppProvider";
import { FRIENDSTATUS } from "src/models/Friend";
import { useAuth } from "src/context/AuthProviderSupabase";

export interface DataRanking {
  profile: Profile;
  value: number;
  uuid?: string;
  extra?: string;
  date?: Date;
  theme?: Theme;
  rank: number;
}
interface Props {
  data: Array<DataRanking>;
  loading?: boolean;
}

export const RankingTable = ({ data, loading = false }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends } = useApp();

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

  const hasGame = useMemo(
    () => data.reduce((acc, value) => acc || value.uuid !== undefined, false),
    [data]
  );

  const getIcon = (rank: number) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey, width: 25, height: 25 }}>
        <Typography variant="h6" color="text.primary">
          {rank}
        </Typography>
      </Avatar>
    );
    switch (rank) {
      case 1:
        icon = <img src={rank1} width={30} loading="lazy" />;
        break;
      case 2:
        icon = <img src={rank2} width={30} loading="lazy" />;
        break;
      case 3:
        icon = <img src={rank3} width={30} loading="lazy" />;
        break;
    }
    return icon;
  };

  return (
    <>
      {data.length === 0 && !loading ? (
        <Alert severity="warning">{t("commun.noresultgame")}</Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: Colors.grey,
            width: percent(100),
            borderTopLeftRadius: px(0),
            borderTopRightRadius: px(0),
          }}
        >
          <Table size="small">
            <TableBody>
              {data.map((el, index) => {
                const isMe = profile && el.profile.id === profile.id;
                const isFriend = idFriend.includes(el.profile.id);
                return (
                  <Fragment key={index}>
                    <TableRow
                      sx={{
                        backgroundColor: isMe
                          ? Colors.blue3
                          : isFriend
                          ? Colors.purple
                          : "initial",
                      }}
                    >
                      <TableCell align="left" sx={{ p: px(4) }}>
                        {getIcon(el.rank)}
                      </TableCell>
                      <TableCell sx={{ p: px(4) }}>
                        <Link
                          to={`/profil/${el.profile.id}`}
                          style={{ textDecoration: "inherit" }}
                        >
                          <AvatarAccount
                            avatar={el.profile.avatar.icon}
                            size={40}
                          />
                        </Link>
                      </TableCell>
                      <TableCell align="left" sx={{ p: px(4) }}>
                        <Link
                          to={`/profil/${el.profile.id}`}
                          style={{ textDecoration: "inherit" }}
                        >
                          <Typography
                            variant={el.theme ? "h4" : "h6"}
                            color={"text.primary"}
                          >
                            {el.profile.username}
                          </Typography>
                        </Link>
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
                            <Box
                              sx={{
                                display: "flex",
                                gap: px(4),
                                alignItems: "center",
                              }}
                            >
                              <ImageThemeBlock theme={el.theme} size={20} />
                              <JsonLanguageBlock
                                variant="body1"
                                value={el.theme.name}
                              />
                            </Box>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ p: px(4) }}>
                        <Typography
                          variant="h2"
                          color="text.primary"
                          component="span"
                        >
                          {el.value}
                        </Typography>
                        {el.extra && (
                          <Typography
                            variant="body1"
                            color="text.primary"
                            component="span"
                          >
                            {el.extra}
                          </Typography>
                        )}
                      </TableCell>
                      {hasGame && (
                        <TableCell sx={{ p: px(4), width: px(40) }}>
                          {el.uuid && (
                            <Link
                              to={`/game/solo/${el.uuid}`}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <VisibilityIcon
                                fontSize="small"
                                sx={{ color: "text.primary" }}
                              />
                            </Link>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  </Fragment>
                );
              })}
              {loading &&
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ p: px(4) }}>
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                    <TableCell align="left" sx={{ p: px(4) }}>
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                    <TableCell align="left" sx={{ p: px(4) }}>
                      <Skeleton variant="rectangular" width={100} height={20} />
                    </TableCell>
                    <TableCell align="right" sx={{ p: px(4) }}>
                      <Skeleton variant="rectangular" width={40} height={25} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
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
        selectRankingSoloByTheme(theme.id, idProfile, max).then((res) => {
          const ranking = res.data as Array<Ranking>;
          const newData = ranking.map((el) => ({
            profile: el.profile,
            value: el.points,
            uuid: el.uuidgame !== null ? el.uuidgame.uuid : undefined,
            extra: t("commun.pointsabbreviation"),
            rank: el.ranking,
            date: el.dategame,
          })) as Array<DataRanking>;
          setData(newData);
          setIsLoading(false);
        });
      } else {
        selectRankingDuelByTheme(theme.id, idProfile, max).then((res) => {
          const ranking = res.data as Array<Ranking>;
          const newData = ranking.map((el) => ({
            profile: el.profile,
            value: el.rank,
            rank: el.ranking,
          })) as Array<DataRanking>;
          setData(newData);
          setIsLoading(false);
        });
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
