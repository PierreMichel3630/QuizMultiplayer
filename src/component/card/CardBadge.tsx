import { Paper, Grid, Typography, Avatar, Skeleton } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge } from "src/models/Badge";
import { Colors } from "src/style/Colors";

interface Props {
  badges: Array<Badge>;
  loading?: boolean;
}

export const CardBadge = ({ badges, loading }: Props) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        overflow: "hidden",
        height: percent(100),
        backgroundColor: Colors.grey,
      }}
    >
      <Grid container>
        <Grid
          sx={{
            backgroundColor: Colors.colorApp,
            p: px(10),
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
          size={12}>
          <Typography variant="h2" color="text.secondary">
            {t("commun.badges")}
          </Typography>
          {!loading && (
            <Typography variant="h4" color="text.secondary">
              ({badges.length})
            </Typography>
          )}
        </Grid>
        <Grid
          sx={{
            display: "flex",
            p: 1,
            maxHeight: viewHeight(15),
            overflowX: "scroll",
          }}
          size={12}>
          <Grid container spacing={1} justifyContent="center">
            {loading ? (
              <>
                {Array.from(new Array(6)).map((_, index) => (
                  <Grid key={index}>
                    <Skeleton variant="circular" width={45} height={45} />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {badges.map((badge) => (
                  <Grid key={badge.id}>
                    <Link to={`/badge/${badge.id}`}>
                      <Avatar
                        sx={{
                          width: 45,
                          height: 45,
                        }}
                        src={badge.icon}
                      />
                    </Link>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
