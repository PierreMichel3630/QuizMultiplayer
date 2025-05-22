import { Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectThemesById } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { CardSelectAvatarTheme } from "./card/CardTheme";

interface Props {
  avatars: Array<{ id: number; avatars: Array<string> }>;
  select: (theme: Theme) => void;
}
export const SelectedTheme = ({ select, avatars }: Props) => {
  const { t } = useTranslation();

  const [themes, setThemes] = useState<Array<Theme>>([]);

  useEffect(() => {
    const idThemes = [...avatars].map((el) => el.id);
    selectThemesById(idThemes).then(({ data }) => {
      const res = data ?? [];
      setThemes(res);
    });
  }, [avatars]);

  return (
    themes.length > 0 && (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("commun.themesselected")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {themes.map((theme, index) => (
              <CardSelectAvatarTheme
                key={index}
                theme={theme}
                avatars={avatars}
                onSelect={() => select(theme)}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
      </Grid>
    )
  );
};
