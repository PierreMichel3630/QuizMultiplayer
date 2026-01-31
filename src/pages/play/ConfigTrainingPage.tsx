import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { launchTrainingGame } from "src/api/game";
import { selectThemeById } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { TextNameBlock } from "src/component/language/TextLanguageBlock";
import { CustomSwitch } from "src/component/Switch";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";

export interface ConfigTraining {
  inputquestion: boolean;
  qcmquestion: boolean;
}
export default function ConfigTrainingPage() {
  const { themeid } = useParams();
  const { uuid, language } = useUser();
  const { mode } = useUser();
  const navigate = useNavigate();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const color = useMemo(
    () => (isDarkMode ? Colors.white : Colors.black),
    [isDarkMode]
  );

  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  const [configGame, setConfigGame] = useState({
    inputquestion: false,
    qcmquestion: true,
  });

  const play = () => {
    if (uuid && themeid && language) {
      launchTrainingGame(uuid, Number(themeid), configGame, language).then(
        ({ data }) => {
          navigate(`/training/${data.uuid}`);
        }
      );
    }
  };

  useEffect(() => {
    const getTheme = () => {
      if (themeid) {
        selectThemeById(Number(themeid)).then((res) => {
          if (res.data) setTheme(res.data as Theme);
        });
      }
    };
    getTheme();
  }, [themeid]);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
      className="page"
    >
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          p: 1,
        }}
      >
        <Grid container spacing={3}>
          {theme && (
            <>
              <Grid sx={{ textAlign: "center", mt: 1 }} size={12}>
                <Typography variant="h1">{t("commun.modetraining")}</Typography>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size={12}>
                <ImageThemeBlock theme={theme} size={40} />
                <TextNameBlock
                  variant="h1"
                  sx={{ fontSize: "20px !important" }}
                  values={theme.themetranslation}
                />
              </Grid>
              <Grid size={12}>
                <Divider
                  sx={{
                    "&::before": {
                      borderTop: `2px solid ${color}`,
                    },
                    "&::after": {
                      borderTop: `2px solid ${color}`,
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      border: `2px solid ${color}`,
                      padding: "5px 10px",
                      borderRadius: "25px",
                    }}
                  >
                    {t("commun.goal")}
                  </Typography>
                </Divider>
              </Grid>
              <Grid size={12}>
                <Typography variant="body1">
                  {t("modes.mode4.explain")}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Divider
                  sx={{
                    "&::before": {
                      borderTop: `2px solid ${color}`,
                    },
                    "&::after": {
                      borderTop: `2px solid ${color}`,
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      border: `2px solid ${color}`,
                      padding: "5px 10px",
                      borderRadius: "25px",
                    }}
                  >
                    {t("commun.configuration")}
                  </Typography>
                </Divider>
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <CustomSwitch
                    checked={configGame.qcmquestion}
                    onChange={() =>
                      setConfigGame((prev) => {
                        const newValue = !prev.qcmquestion;
                        return {
                          ...prev,
                          qcmquestion: newValue,
                          inputquestion:
                            newValue === false ? true : prev.inputquestion,
                        };
                      })
                    }
                    color="default"
                  />
                  <Typography variant="h4">{t("commun.qcm")}</Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <CustomSwitch
                    checked={configGame.inputquestion}
                    onChange={() =>
                      setConfigGame((prev) => {
                        const newValue = !prev.inputquestion;
                        return {
                          ...prev,
                          inputquestion: newValue,
                          qcmquestion:
                            newValue === false ? true : prev.qcmquestion,
                        };
                      })
                    }
                    color="default"
                  />
                  <Typography variant="h4">
                    {t("commun.inputquestion")}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                <ButtonColor
                  value={Colors.blue2}
                  label={t("commun.play")}
                  icon={PlayCircleIcon}
                  onClick={() => play()}
                  variant="contained"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
