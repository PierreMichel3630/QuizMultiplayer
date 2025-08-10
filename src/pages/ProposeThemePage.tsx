import AddCircleIcon from "@mui/icons-material/AddCircle";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectThemesPropose } from "src/api/theme";
import { CardImage } from "src/component/card/CardImage";
import { ProposeThemeModal } from "src/component/modal/ProposeThemeModal";
import { GoBackButtonIcon } from "src/component/navigation/GoBackButton";
import { SkeletonThemesGrid } from "src/component/skeleton/SkeletonTheme";
import { useUser } from "src/context/UserProvider";
import { ProposeTheme } from "src/models/Theme";
import { sortByVoteDesc } from "src/utils/sort";

export default function ProposeThemePage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [themes, setThemes] = useState<Array<ProposeTheme>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalPropose, setOpenModalPropose] = useState(false);

  const getThemePropose = useCallback(() => {
    setIsLoading(true);
    if (language) {
      selectThemesPropose(language.iso).then(({ data }) => {
        const res = data ?? [];
        setThemes([...res].sort(sortByVoteDesc));
        setIsLoading(false);
      });
    }
  }, [language]);

  useEffect(() => {
    getThemePropose();
  }, [getThemePropose]);

  const onProposeTheme = () => {
    setOpenModalPropose(true);
  };

  const onCloseModalPropose = () => {
    setOpenModalPropose(false);
    getThemePropose();
  };

  const cardThemes = useMemo(
    () =>
      themes.map((theme, index) => {
        const image = theme.image ?? (
          <NoPhotographyIcon
            sx={{
              width: 60,
              height: 60,
              color: "white",
            }}
          />
        );
        return {
          id: index,
          name: theme.title,
          color: theme.color,
          image,
          link: `/theme/${theme.id}`,
        };
      }),
    [themes]
  );

  return (
    <Container maxWidth="md">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.proposetheme.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={1} justifyContent="center">
              <Grid item>
                <GoBackButtonIcon />
              </Grid>
              <Grid item xs sx={{ textAlign: "center" }}>
                <Typography variant="h2">{t("commun.proposetheme")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {t("commun.proposethemetext")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<AddCircleIcon />}
                  color="secondary"
                  onClick={onProposeTheme}
                  sx={{ p: 1, height: "fit-content" }}
                >
                  <Typography variant="h6">
                    {t("commun.proposetheme")}
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4">
                  {t("commun.proposethemes")}
                </Typography>
              </Grid>
              {cardThemes.map((value, index) => (
                <Grid item key={index}>
                  <CardImage value={value} />
                </Grid>
              ))}
              {isLoading && <SkeletonThemesGrid number={10} />}
              {!isLoading && cardThemes.length === 0 && (
                <Grid item xs={12}>
                  <Alert severity="warning">{t("commun.noresult")}</Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <ProposeThemeModal open={openModalPropose} close={onCloseModalPropose} />
    </Container>
  );
}
