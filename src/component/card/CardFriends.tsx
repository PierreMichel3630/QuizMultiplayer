import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { SkeletonAvatarPlayers } from "../skeleton/SkeletonPlayer";

interface Props {
  friends: Array<Profile>;
  loading?: boolean;
}

export const CardFriends = ({ friends, loading }: Props) => {
  const { t } = useTranslation();

  return (
    friends.length > 0 && (
      <Paper
        sx={{
          overflow: "hidden",
          height: percent(100),
          backgroundColor: Colors.grey,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: Colors.blue3,
              p: px(10),
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="h2" color="text.secondary">
              {t("commun.friends")}
            </Typography>
            {!loading && (
              <Typography variant="h4" color="text.secondary">
                ({friends.length})
              </Typography>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              p: 1,
              maxHeight: viewHeight(18),
              overflowX: "scroll",
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              {loading ? (
                <SkeletonAvatarPlayers number={4} />
              ) : (
                <>
                  {friends.map((friend, index) => (
                    <Grid item xs={4} sm={3} md={3} lg={2} key={index}>
                      <Link
                        to={`/profil/${friend.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            textAlign: "center",
                          }}
                        >
                          <AvatarAccount
                            avatar={friend.avatar.icon}
                            size={60}
                            backgroundColor={Colors.grey2}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              overflow: "hidden",
                              display: "block",
                              lineClamp: 1,
                              boxOrient: "vertical",
                              textOverflow: "ellipsis",
                              width: percent(100),
                            }}
                          >
                            {friend.username}
                          </Typography>
                        </Box>
                      </Link>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  );
};
