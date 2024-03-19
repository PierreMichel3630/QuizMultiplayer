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
}

export const RankingTable = ({ scores, myscore }: Props) => {
  const { profile } = useAuth();
  const getIcon = (rank: number) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey, width: 30, height: 30 }}>
        <Typography variant="h6">{rank}</Typography>
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
      sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", width: percent(100) }}
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
                <Typography variant="h6">{score.profile.username}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ p: px(4) }}>
                <Typography variant="h2">{score.points}</Typography>
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
                  <Typography variant="h6">{profile.username}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ p: px(4) }}>
                  <Typography variant="h2">
                    {myscore ? myscore.points : "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
