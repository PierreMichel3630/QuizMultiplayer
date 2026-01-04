import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { urlApple, urlGooglePlay } from "src/pages/help/InstallationPage";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { HeadTitle } from "../HeadTitle";

import AppleIcon from "@mui/icons-material/Apple";
import googleplay from "src/assets/google-play.png";

export const HeaderApp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <HeadTitle
      title={t("appname")}
      sx={{
        fontFamily: ["Kalam", "cursive"].join(","),
        fontSize: 80,
        fontWeight: 700,
        "@media (max-width:600px)": {
          fontSize: 50,
        },
      }}
      extra={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: px(5),
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <ButtonColor
              value={Colors.white}
              label={t("commun.howtoplay")}
              variant="outlined"
              typography="h6"
              onClick={() => navigate("/help")}
              noWrap
            />
            <ButtonColor
              value={Colors.white}
              label={t("commun.faq")}
              variant="outlined"
              typography="h6"
              onClick={() => navigate("/faq")}
              noWrap
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link
              to={urlGooglePlay}
              style={{
                textDecoration: "inherit",
              }}
            >
              <Box
                sx={{
                  borderRadius: px(5),
                  p: px(6),
                  backgroundColor: Colors.black,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                <img
                  alt="logo google play"
                  src={googleplay}
                  style={{ width: px(20) }}
                />
                <Typography variant="h6" color="text.secondary" noWrap>
                  {t("commun.googleplay")}
                </Typography>
              </Box>
            </Link>
            <Link
              to={urlApple}
              style={{
                textDecoration: "inherit",
              }}
            >
              <Box
                sx={{
                  borderRadius: px(5),
                  p: px(6),
                  backgroundColor: Colors.black,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                <AppleIcon sx={{ color: "white", fontSize: px(20) }} />
                <Typography variant="h6" color="text.secondary">
                  {t("commun.apple")}
                </Typography>
              </Box>
            </Link>
          </Box>
        </Box>
      }
    />
  );
};
