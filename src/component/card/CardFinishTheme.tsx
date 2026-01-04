import { Grid, Paper, Skeleton, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFinishThemeByProfile } from "src/api/ranking";
import { selectThemesById } from "src/api/theme";
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

interface Props {
  profile: Profile;
}

export const CardFinishTheme = ({ profile }: Props) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  useEffect(() => {
    setLoading(true);
    getFinishThemeByProfile(profile.id).then(({ data }) => {
      if (data !== null) {
        const idThemes = data.themes;
        selectThemesById(idThemes).then(({ data }) => {
          const res = data ?? [];
          setThemes(res);
          setLoading(false);
        });
      }
    });
  }, [profile]);

  return (
    themes.length > 0 && (
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
              {t("commun.finishtheme")}
            </Typography>
            {!loading && (
              <Typography variant="h4" color="text.secondary">
                ({themes.length})
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
                  {themes.map((theme) => (
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
