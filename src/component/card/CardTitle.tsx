import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { TitleProfile } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { sortTitle } from "src/utils/sort";
import { BadgeTitleProfile } from "../Badge";

interface Props {
  titles: Array<TitleProfile>;
  loading?: boolean;
}

export const CardTitle = ({ titles, loading }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const titleOrder = useMemo(
    () =>
      language
        ? [...titles].sort((a, b) => sortTitle(language, a.title, b.title))
        : [],
    [titles, language]
  );

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
          item
          xs={12}
          sx={{
            backgroundColor: Colors.colorApp,
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
                  {titleOrder.map((title, index) => (
                    <Grid item key={index}>
                      <Link
                        to={`/title/${title.title.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <BadgeTitleProfile title={title} />
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
