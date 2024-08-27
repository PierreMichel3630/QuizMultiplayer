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
import { Fragment, useMemo } from "react";
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

export interface DataRanking {
  profile: Profile;
  value: number;
  uuid?: string;
  extra?: string;
  theme?: Theme;
}
export interface DataRankingMe extends DataRanking {
  rank?: number;
}
interface Props {
  data: Array<DataRanking>;
  me?: DataRankingMe;
  loading?: boolean;
}

export const RankingTable = ({ data, me, loading = false }: Props) => {
  const { t } = useTranslation();
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

  const isMeDisplay = useMemo(() => {
    const profileId = data.map((el) => el.profile.id);
    return me && profileId.includes(me.profile.id);
  }, [me, data]);

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
              {data.map((el, index) => (
                <Fragment key={index}>
                  <TableRow>
                    <TableCell align="left" sx={{ p: px(4) }}>
                      {getIcon(index + 1)}
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
                          color="text.primary"
                        >
                          {el.profile.username}
                        </Typography>
                      </Link>
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
                              sx={{ color: Colors.black }}
                            />
                          </Link>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                </Fragment>
              ))}
              {me && !isMeDisplay && (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" sx={{ p: px(4) }}>
                    {me.rank ? getIcon(me.rank) : ""}
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
                    <Typography
                      variant="h2"
                      color="text.primary"
                      component="span"
                    >
                      {me.value}
                    </Typography>
                    {me.extra && (
                      <Typography
                        variant="body1"
                        color="text.primary"
                        component="span"
                      >
                        {me.extra}
                      </Typography>
                    )}
                  </TableCell>
                  {hasGame && (
                    <TableCell align="right" sx={{ p: px(4), width: px(40) }}>
                      {me.uuid && (
                        <Link
                          to={`/game/solo/${me.uuid}`}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <VisibilityIcon
                            fontSize="small"
                            sx={{ color: Colors.black }}
                          />
                        </Link>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
              {loading &&
                Array.from(new Array(10)).map((_, index) => (
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
