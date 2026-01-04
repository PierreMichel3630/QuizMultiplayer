import { Box, Container, Divider, Grid } from "@mui/material";
import { percent } from "csx";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { BasicSearchInput } from "src/component/Input";
import { ShareApplicationBlock } from "src/component/ShareApplicationBlock";
import { FriendScrollBlock } from "src/component/scroll/FriendScrollBlock";
import { PeopleScrollBlock } from "src/component/scroll/PeopleScrollBlock";
import { useApp } from "src/context/AppProvider";

export default function PeoplePage() {
  const { t } = useTranslation();
  const { headerSize } = useApp();

  const [search, setSearch] = useState("");

  return (
    <Box sx={{ width: percent(100) }}>
      <Helmet>
        <title>{`${t("pages.people.title")} - ${t("appname")}`}</title>
        <meta
          name="description"
          content="Faites-vous des amis et défiez-les à travers des quiz sur une multitude de thèmes."
        />
      </Helmet>
      <Box
        sx={{
          position: "sticky",
          top: headerSize,
          zIndex: 3,
          p: 1,
          width: percent(100),
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="md">
          <BasicSearchInput
            label={t("commun.search")}
            value={search}
            onChange={setSearch}
            clear={() => setSearch("")}
          />
        </Container>
      </Box>
      <Box sx={{ width: percent(100), p: 1 }}>
        <Grid container spacing={1} sx={{ position: "relative" }}>
          <Grid size={12}>
            <ShareApplicationBlock title={t("commun.sharefriend")} />
          </Grid>
          <Grid size={12}>
            <FriendScrollBlock search={search} />
          </Grid>
          <Grid size={12}>
            <Divider sx={{ borderBottomWidth: 3 }} />
          </Grid>
          <Grid size={12}>
            <PeopleScrollBlock search={search} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
