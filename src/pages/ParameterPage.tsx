import { Box, Grid, Radio, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { px } from "csx";
import { useMemo } from "react";
import { PageBarNavigation } from "src/component/page/PageBarNavigation";
import { LanguageSelect } from "src/component/select/LanguageSelect";
import { UpdateAppVersionBlock } from "src/component/UpdateAppVersionBlock";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

export default function ParameterPage() {
  const { t } = useTranslation();
  const { mode, setMode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const onChangeMode = (value: "light" | "dark") => {
    setMode(value);
  };

  return (
    <>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <PageBarNavigation title={t("pages.parameters.title")}>
        <Grid container spacing={2} justifyContent="center" sx={{ p: 1 }}>
          <Grid size={12}>
            <Typography variant="h4">{t("commun.displaymode")}</Typography>
          </Grid>
          <Grid>
            <Box
              onClick={() => onChangeMode("dark")}
              sx={{
                cursor: "pointer",
                border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
                borderRadius: px(15),
                padding: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: px(5),
                backgroundColor: Colors.black,
                color: Colors.white,
                width: px(150),
              }}
            >
              <DarkModeIcon sx={{ fontSize: px(50), color: Colors.white }} />
              <Box sx={{ display: "flex", gap: px(4), alignItems: "center" }}>
                <Radio checked={isDarkMode} sx={{ p: 0 }} />
                <Typography variant="h6">{t("commun.darkmode")}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <Box
              onClick={() => onChangeMode("light")}
              sx={{
                cursor: "pointer",
                border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
                borderRadius: px(15),
                padding: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: px(5),
                backgroundColor: Colors.white,
                color: Colors.black,
                width: px(150),
              }}
            >
              <LightModeIcon sx={{ fontSize: px(50), color: Colors.yellow4 }} />
              <Box sx={{ display: "flex", gap: px(4), alignItems: "center" }}>
                <Radio
                  checked={!isDarkMode}
                  sx={{
                    p: 0,
                    color: Colors.black,
                    "&.Mui-checked": {
                      color: Colors.black,
                    },
                  }}
                />
                <Typography variant="h6">{t("commun.lightmode")}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={12}>
            <Typography variant="h4">{t("commun.languages")}</Typography>
          </Grid>
          <Grid size={12}>
            <LanguageSelect />
          </Grid>
          <Grid size={12}>
            <UpdateAppVersionBlock />
          </Grid>
        </Grid>
      </PageBarNavigation>
    </>
  );
}
