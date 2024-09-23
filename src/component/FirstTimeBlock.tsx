import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { Link } from "react-router-dom";
import { percent, px } from "csx";

import LaptopIcon from "@mui/icons-material/Laptop";
import AppleIcon from "@mui/icons-material/Apple";
import googleplay from "src/assets/google-play.png";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { ModesBlock } from "./ModeBlock";

interface Props {
  onQuit: () => void;
}
export const FirstTimeBlock = ({ onQuit }: Props) => {
  const { t } = useTranslation();

  const urlGooglePlay =
    "https://play.google.com/store/apps/details?id=app.web.quizup_v2.twa&hl=fr";
  const urlPc = "https://quizbattle.fr";
  const urlApple = "https://quizbattle.fr/installation";

  return (
    <Box>
      <Box sx={{ p: 1, backgroundColor: Colors.blue3, minHeight: "100vh" }}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 7 }}>
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Typography
                variant="h1"
                color="text.secondary"
                sx={{
                  fontFamily: ["Kalam", "cursive"].join(","),
                  fontSize: 80,
                  fontWeight: 700,
                  "@media (max-width:600px)": {
                    fontSize: 40,
                  },
                }}
              >
                {t("tutorial.title")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                <Box>
                  <Link
                    to={urlGooglePlay}
                    style={{
                      textDecoration: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: px(5),
                        p: 1,
                        backgroundColor: Colors.black,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <img src={googleplay} style={{ width: px(25) }} />
                      <Typography variant="h6" color="text.secondary">
                        {t("commun.googleplay")}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
                <Box>
                  <Link
                    to={urlApple}
                    style={{
                      textDecoration: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: px(5),
                        p: 1,
                        backgroundColor: Colors.black,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <AppleIcon sx={{ color: "white" }} />
                      <Typography variant="h6" color="text.secondary">
                        {t("commun.apple")}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
                <Box>
                  <Link
                    to={urlPc}
                    style={{
                      textDecoration: "inherit",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: px(5),
                        p: 1,
                        backgroundColor: Colors.black,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}
                    >
                      <LaptopIcon sx={{ color: "white" }} />
                      <Typography variant="h6" color="text.secondary">
                        {t("commun.computer")}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                {t("tutorial.explain")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider
                sx={{
                  "&::before": {
                    borderTop: "2px solid white",
                  },
                  "&::after": {
                    borderTop: "2px solid white",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    border: "2px solid white",
                    padding: "5px 10px",
                    borderRadius: "25px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {t("commun.gamemode")}
                </Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <ModesBlock />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          p: 1,
          width: percent(100),
          backgroundColor: Colors.blue3,
        }}
      >
        <Container maxWidth="md">
          <Button
            variant="outlined"
            sx={{
              minWidth: "auto",
              textTransform: "uppercase",
              backgroundColor: "black",
            }}
            fullWidth
            size="large"
            onClick={() => onQuit()}
          >
            <Typography variant="h2" noWrap color="text.secondary">
              {t("commun.letgo")}
            </Typography>
          </Button>
        </Container>
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: 5,
          right: 5,
        }}
      >
        <HighlightOffIcon
          fontSize="large"
          onClick={() => onQuit()}
          sx={{ color: "white", cursor: "pointer" }}
        />
      </Box>
    </Box>
  );
};
