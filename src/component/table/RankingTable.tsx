import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { AvatarAccount } from "../avatar/AvatarAccount";

import { percent, px } from "csx";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { useMemo } from "react";

export interface DataRanking {
  profile: Profile;
  value: number;
}
export interface DataRankingMe extends DataRanking {
  rank?: number;
}
interface Props {
  data: Array<DataRanking>;
  me?: DataRankingMe;
}

export const RankingTable = ({ data, me }: Props) => {
  const getIcon = (rank: number) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey, width: 30, height: 30 }}>
        <Typography variant="h6" color="text.primary">
          {rank}
        </Typography>
      </Avatar>
    );
    switch (rank) {
      case 1:
        icon = <img src={rank1} width={30} />;
        break;
      case 2:
        icon = <img src={rank2} width={30} />;
        break;
      case 3:
        icon = <img src={rank3} width={30} />;
        break;
    }
    return icon;
  };

  const isMeDisplay = useMemo(() => {
    const profileId = data.map((el) => el.profile.id);
    return me && profileId.includes(me.profile.id);
  }, [me, data]);

  return (
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
          {data.map((el, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" sx={{ p: px(4) }}>
                {getIcon(index + 1)}
              </TableCell>
              <TableCell sx={{ p: px(4) }}>
                <AvatarAccount avatar={el.profile.avatar.icon} size={30} />
              </TableCell>
              <TableCell align="left" sx={{ p: px(4) }}>
                <Typography variant="h6" color="text.primary">
                  {el.profile.username}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ p: px(4) }}>
                <Typography variant="h2" color="text.primary">
                  {el.value}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
          {me && !isMeDisplay && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" sx={{ p: px(4) }}>
                {me.rank ? getIcon(me.rank) : "-"}
              </TableCell>
              <TableCell sx={{ p: px(4) }}>
                <AvatarAccount avatar={me.profile.avatar.icon} size={30} />
              </TableCell>
              <TableCell align="left" sx={{ p: px(4) }}>
                <Typography variant="h6" color="text.primary">
                  {me.profile.username}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ p: px(4) }}>
                <Typography variant="h2" color="text.primary">
                  {me.value}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
