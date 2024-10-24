import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";
import { AccountMenu } from "../header/AccountMenu";

interface Props {
  title: string;
  quit?: () => void;
}
export const BarNavigation = ({ title, quit }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useAuth();
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: percent(100),
        backgroundColor: Colors.blue3,
        zIndex: 100,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ p: px(5) }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid
              item
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (quit) {
                  quit();
                } else {
                  navigate("/");
                }
              }}
            >
              <KeyboardBackspaceIcon sx={{ color: Colors.white }} />
            </Grid>
            <Grid item xs sx={{ textAlign: "center" }}>
              <Typography variant="h2" sx={{ color: Colors.white }}>
                {title}
              </Typography>
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
    </Box>
  );
};
