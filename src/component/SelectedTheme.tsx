import { Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getThemesById } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "./card/CardImage";
import { CardSelectAvatarTheme } from "./card/CardTheme";

interface Props {
  avatars: Array<{ id: number; avatars: Array<string> }>;
  select: (theme: ICardImage) => void;
}
export const SelectedTheme = ({ select, avatars }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [themes, setThemes] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const idThemes = [...avatars].map((el) => el.id);
    if (language && idThemes.length > 0) {
      getThemesById(idThemes, language).then(({ data }) => {
        const res = data ?? [];
        setThemes(res);
      });
    }
  }, [avatars, language]);

  return (themes.length > 0 && (<Grid container spacing={1}>
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      size={12}>
      <Typography variant="h2">{t("commun.themesselected")}</Typography>
    </Grid>
    <Grid size={12}>
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
    <Grid size={12}>
      <Divider sx={{ borderBottomWidth: 5 }} />
    </Grid>
  </Grid>));
};
