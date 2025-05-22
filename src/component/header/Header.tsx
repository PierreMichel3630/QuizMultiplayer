import { Box, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { padding, px } from "csx";
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
        background: Colors.colorApp,
      }}
    >
      <Container maxWidth="md">
        <Box>
          {user ? (
            <ProfileBar />
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
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
          )}
        </Box>
      </Container>
    </Box>
  );
};
