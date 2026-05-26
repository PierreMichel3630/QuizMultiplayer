import {
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
import { useMemo } from "react";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";
import { Colors } from "src/style/Colors";
import { CountryImageBlock } from "../CountryBlock";

import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { ThemeBlock } from "../theme/ThemeBlock";
import { ProfileTitleBlock } from "../title/ProfileTitle";

export interface DataRankingChallenge {
  profile: Profile;
  value: JSX.Element;
  rank: number;
  uuid?: string;
  theme?: Theme
  data?: any
}

interface Props {
  data: Array<DataRankingChallenge>;
  loading?: boolean;
  onClick?: (value: DataRankingChallenge) => void;
}

export const RankingChallengeTable = ({ data, onClick, loading = false }: Props) => {
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
                [] as Array<string>,
              ),
          ]
        : [],
    [friends, profile],
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
              const isMe = el.profile.id === profile?.id;
              const isFriend = idFriend.includes(el.profile.id);
              const colorFriend = isFriend ? Colors.purple : "initial";
              const color = isMe ? Colors.colorApp : colorFriend;

              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: color,
                    cursor: onClick ? "pointer" : "default",
                    textDecoration: "inherit",
                  }}
                  onClick={() => {
                    if(onClick) onClick(el);
                  }}
                >
                  <TableCell align="left" sx={{ p: px(4), width: px(40) }}>
                    {getIcon(el.rank)}
                  </TableCell>
                  <TableCell sx={{ p: px(4), width: px(45) }}>
                    <AvatarAccount avatar={el.profile.avatar.icon} size={38} />
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
                      <Box
                        sx={{
                          textDecoration: "inherit",
                          display: "flex",
                          gap: px(4),
                          alignItems: "center",
                        }}
                      >
                        {el.profile.country && (
                          <CountryImageBlock
                            country={el.profile.country}
                            size={20}
                          />
                        )}
                        <Typography variant={"h6"} noWrap>
                          {el.profile.username}
                        </Typography>
                      </Box>
                      <ProfileTitleBlock
                        titleprofile={el.profile.titleprofile}
                      />
                      {el.theme && <ThemeBlock theme={el.theme} />}
                    </Box>
                  </TableCell>
                  {el.value}
                </TableRow>
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
    </Box>
  );
};
