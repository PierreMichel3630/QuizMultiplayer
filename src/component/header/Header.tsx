import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ProfileBar } from "../ProfileBar";
import { DarkModeButton } from "../button/DarkModeButton";

export const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useAuth();

  return (
    <Box
      sx={{
        backgroundColor: Colors.blue3,
      }}
    >
      <Container maxWidth="md">
        <Box>
          {user ? (
            <ProfileBar />
          ) : (
            <Box
              sx={{ display: "flex", gap: 1, p: 1, justifyContent: "flex-end" }}
            >
              <DarkModeButton />
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
