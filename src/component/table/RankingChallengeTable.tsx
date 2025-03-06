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

import { percent, px } from "csx";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { ChallengeRanking } from "src/models/Challenge";
import { FRIENDSTATUS } from "src/models/Friend";
import { Colors } from "src/style/Colors";
import { CountryImageBlock } from "../CountryBlock";

interface Props {
  data: Array<ChallengeRanking>;
  loading?: boolean;
}

export const RankingChallengeTable = ({ data, loading = false }: Props) => {
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

  const getIcon = (rank: number, colorText: string) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey, width: 25, height: 25 }}>
        <Typography
          variant="h6"
          sx={{
            color: colorText,
          }}
        >
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
        >
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableBody>
              {data.map((el, index) => {
                const isMe = profile && el.profile.id === profile.id;
                const isFriend = idFriend.includes(el.profile.id);
                const colorFriend = isFriend ? Colors.purple : "initial";
                const color = isMe ? Colors.blue3 : colorFriend;
                const colorText =
                  isMe || isFriend ? Colors.white : "text.primary";

                return (
                  <Fragment key={index}>
                    <TableRow
                      sx={{
                        backgroundColor: color,
                      }}
                    >
                      <TableCell align="left" sx={{ p: px(4), width: px(40) }}>
                        {getIcon(el.ranking, colorText)}
                      </TableCell>
                      <TableCell sx={{ p: px(4), width: px(50) }}>
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
                              <CountryImageBlock country={el.profile.country} />
                            )}
                            <Typography
                              variant={"h6"}
                              sx={{
                                color: colorText,
                              }}
                              noWrap
                            >
                              {el.profile.username}
                            </Typography>
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ p: px(4), width: px(60) }}>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            color: colorText,
                          }}
                          noWrap
                        >
                          {el.score} / {NUMBER_QUESTIONS_CHALLENGE}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ p: px(4), width: px(60) }}>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            color: colorText,
                          }}
                          noWrap
                        >
                          {(el.time / 1000).toFixed(2)}s
                        </Typography>
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
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
