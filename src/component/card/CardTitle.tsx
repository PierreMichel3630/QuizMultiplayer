import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { BadgeTitle } from "../Badge";
import { useMemo } from "react";
import { sortByTitle } from "src/utils/sort";
import { useUser } from "src/context/UserProvider";
import { Link } from "react-router-dom";

interface Props {
  titles: Array<Title>;
  loading?: boolean;
}

export const CardTitle = ({ titles, loading }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const titleOrder = useMemo(
    () => titles.sort((a, b) => sortByTitle(language, a, b)),
    [titles, language]
  );

  return (
    <Paper
      sx={{
        overflow: "hidden",
        backgroundColor: Colors.lightgrey,
        height: percent(100),
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
            {t("commun.titles")}
          </Typography>
          {!loading && (
            <Typography variant="h4" color="text.secondary">
              ({titles.length})
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              p: 1,
              mb: 1,
              maxHeight: viewHeight(15),
              overflowX: "scroll",
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              {loading ? (
                <>
                  {Array.from(new Array(6)).map((_, index) => (
                    <Grid item key={index}>
                      <Skeleton variant="rectangular" width={85} height={20} />
                    </Grid>
                  ))}
                </>
              ) : (
                <>
                  {titleOrder.map((title) => (
                    <Grid item key={title.id}>
                      <Link
                        to={`/title/${title.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <BadgeTitle label={title.name} />
                      </Link>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
