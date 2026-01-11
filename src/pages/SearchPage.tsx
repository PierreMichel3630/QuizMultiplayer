import { Box, Grid } from "@mui/material";
import { percent } from "csx";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { useLocation } from "react-router-dom";
import { BadgeButtonRedirection } from "src/component/button/BadgeButton";
import { SearchThemeScrollBlock } from "src/component/scroll/SearchThemeScrollBlock";
import { useAppBar } from "src/context/AppBarProvider";

export default function SearchPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { top } = useAppBar();
  const { search } = location.state ?? { search: "" };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.search.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box
          sx={{
            width: percent(100),
            p: 1,
            position: "relative",
          }}
        >
          <Grid container spacing={1}>
            <Grid
              size={12}
              sx={{
                position: "sticky",
                top: top,
                zIndex: 3,
                bgcolor: "background.paper",
                gap: 1,
                transition: "top 350ms ease-in-out",
                display: "flex",
                flexDirection: "column",
                pt: 1,
              }}
            >
              <BadgeButtonRedirection />
            </Grid>
            <Grid size={12}>
              <SearchThemeScrollBlock search={search} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
