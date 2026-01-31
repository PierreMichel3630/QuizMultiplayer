import { Box, Grid } from "@mui/material";
import { percent } from "csx";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { BadgeButtonRedirection } from "src/component/button/BadgeButton";
import { BasicSearchInput } from "src/component/Input";
import { PageBarNavigation } from "src/component/page/PageBarNavigation";
import { SearchThemeScrollBlock } from "src/component/scroll/SearchThemeScrollBlock";

export default function SearchMobilePage() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");

  return (
    <>
      <Helmet>
        <title>{`${t("pages.search.title")} - ${t("appname")}`}</title>
      </Helmet>
      <PageBarNavigation
        content={
          <BasicSearchInput
            label={t("commun.search")}
            onChange={setSearch}
            clear={() => setSearch("")}
            value={search}
            autoFocus
          />
        }
      >
        <Grid container spacing={2} justifyContent="center" sx={{ p: 1 }}>
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
      </PageBarNavigation>
    </>
  );
}
