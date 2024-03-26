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
import { MyScore, Score } from "src/models/Score";
import { AvatarAccount } from "../avatar/AvatarAccount";

import { percent, px } from "csx";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

interface Props {
  scores: Array<Score>;
  myscore?: MyScore;
  type?: "points" | "games";
}

export const RankingTable = ({ scores, myscore, type = "points" }: Props) => {
  const { profile } = useAuth();
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
          {scores.map((score, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" sx={{ p: px(4) }}>
                {getIcon(index + 1)}
              </TableCell>
              <TableCell sx={{ p: px(4) }}>
                <AvatarAccount avatar={score.profile.avatar} size={30} />
              </TableCell>
              <TableCell align="left" sx={{ p: px(4) }}>
                <Typography variant="h6" color="text.primary">
                  {score.profile.username}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ p: px(4) }}>
                <Typography variant="h2" color="text.primary">
                  {score[type]}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
          {profile !== null &&
            ((myscore && myscore.rank > 3) || myscore === undefined) && (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left" sx={{ p: px(4) }}>
                  <Avatar sx={{ bgcolor: Colors.grey, width: 30, height: 30 }}>
                    <Typography variant="h6">
                      {myscore ? myscore.rank : "-"}
                    </Typography>
                  </Avatar>
                </TableCell>
                <TableCell sx={{ p: px(4) }}>
                  <AvatarAccount avatar={profile.avatar} size={30} />
                </TableCell>
                <TableCell align="left" sx={{ p: px(4) }}>
                  <Typography variant="h6" color="text.primary">
                    {profile.username}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ p: px(4) }}>
                  <Typography variant="h2" color="text.primary">
                    {myscore ? myscore[type] : "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
