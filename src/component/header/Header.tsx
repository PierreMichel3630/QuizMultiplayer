import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { padding, px } from "csx";
import logo from "src/assets/logo.svg";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ProfileBar } from "../ProfileBar";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useAuth();

  return (
    <Box
      sx={{
        flex: 1,
      }}
    >
      <Box>
        {user ? (
          <ProfileBar />
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                textDecoration: "none",
              }}
              component={Link}
              to="/"
            >
              <img alt="logo" src={logo} width={45} />
              <Typography
                variant="h2"
                color="text.secondary"
                sx={{ fontFamily: ["Kalam", "cursive"].join(",") }}
              >
                {t("appname")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link to={`/parameters`}>
                <Box
                  sx={{
                    p: padding(2, 8),
                    border: "2px solid",
                    borderColor: Colors.white,
                    borderRadius: px(5),
                    display: "flex",
                  }}
                >
                  <SettingsIcon sx={{ color: Colors.white }} />
                </Box>
              </Link>
              <ButtonColor
                value={Colors.black}
                label={t("commun.login")}
                icon={AccountCircleIcon}
                variant="contained"
                onClick={() => navigate("/login")}
                typography="h6"
                fullWidth={false}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
