import { Grid, Paper, Skeleton, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { uniqBy } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { Score } from "src/models/Score";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

interface Props {
  scores: Array<Score>;
  loading?: boolean;
}

export const CardFinishTheme = ({ scores, loading }: Props) => {
  const { t } = useTranslation();

  const { themes } = useApp();

  const themesFinish = useMemo(() => {
    const result = scores
      .filter((score) => {
        const theme = themes.find((el) => el.id === score.theme.id);
        return (
          theme &&
          theme.questions !== null &&
          theme.questions > 0 &&
          theme.questions <= score.points
        );
      })
      .map((el) => el.theme);

    return uniqBy(result, (el) => el.id);
  }, [scores, themes]);

  return (
    themesFinish.length > 0 && (
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
              {t("commun.finishtheme")}
            </Typography>
            {!loading && (
              <Typography variant="h4" color="text.secondary">
                ({themesFinish.length})
              </Typography>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              p: 1,
              maxHeight: viewHeight(15),
              overflowX: "scroll",
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              {loading ? (
                <>
                  {Array.from(new Array(6)).map((_, index) => (
                    <Grid item key={index}>
                      <Skeleton variant="circular" width={45} height={45} />
                    </Grid>
                  ))}
                </>
              ) : (
                <>
                  {themesFinish.map((theme) => (
                    <Grid item key={theme.id}>
                      <Link to={`/theme/${theme.id}`}>
                        <ImageThemeBlock theme={theme} size={35} />
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
