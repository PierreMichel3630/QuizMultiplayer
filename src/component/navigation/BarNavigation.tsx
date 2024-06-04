import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Colors } from "src/style/Colors";
import { AccountMenu } from "../header/AccountMenu";
import { LanguagesMenu } from "../header/LanguageMenu";

interface Props {
  title: string;
}
export const BarNavigation = ({ title }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useAuth();
  return (
    <AppBar position="fixed" color="secondary">
      <Container maxWidth="lg">
        <Box sx={{ backgroundColor: Colors.blue3, p: 1 }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item sx={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
              <KeyboardBackspaceIcon sx={{ color: Colors.white }} />
            </Grid>
            <Grid item xs sx={{ textAlign: "center" }}>
              <Typography variant="h2" sx={{ color: Colors.white }}>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <LanguagesMenu />
            </Grid>
            <Grid item>
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <Box>
                  <Button
                    endIcon={<AccountCircleIcon />}
                    onClick={() => navigate("login")}
                    variant="contained"
                  >
                    <Typography variant="body1">{t("commun.login")}</Typography>
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </AppBar>
  );
};
