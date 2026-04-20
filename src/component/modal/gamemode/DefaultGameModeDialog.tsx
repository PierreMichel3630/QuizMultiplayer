import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { CountryBlock } from "src/component/CountryBlock";
import { ProfileTitleBlock } from "src/component/title/ProfileTitle";
import { GameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";

export interface PropsDialogGameMode {
  data?: GameModeScore;
  fixed?: number;
  unit?: string;
  open: boolean;
  close: () => void;
}

interface PropsExtra extends PropsDialogGameMode {
  extra?: JSX.Element;
}

export const DefaultGameModeDialog = ({
  data,
  open,
  close,
  extra,
  unit,
  fixed = 0,
}: PropsExtra) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog onClose={close} open={open} maxWidth="md" fullScreen={fullScreen}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.result")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {data && (
          <Grid container spacing={2}>
            <Grid
              size={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AvatarAccountBadge
                profile={data.profile}
                size={80}
                color={Colors.pink}
              />
              {data.profile.country && (
                <CountryBlock
                  country={data.profile.country}
                  color="text.secondary"
                />
              )}
              <Typography
                variant="h2"
                color="text.secondary"
                sx={{
                  textShadow: "1px 1px 2px black",
                }}
              >
                {data.profile.username}
              </Typography>
              <ProfileTitleBlock titleprofile={data.profile.titleprofile} />
            </Grid>
            <Grid size={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: px(4),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {data.games}
                </Typography>
                <Typography variant="subtitle1">{t("commun.games")}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: px(5),
                }}
              >
                <Typography variant="body1">
                  {t("commun.averagepergame")} :
                </Typography>
                <Typography variant="h6">
                  {data.average?.toFixed(fixed)} {unit}
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={12}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{textAlign: "center"}}>
                <Typography variant="subtitle1" component="span">
                  {t("gamemode.record")} :
                </Typography>
                <Typography
                  variant="h3"
                  color="primary"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  {`  ${data.score?.toFixed(fixed)}`} {unit}
                </Typography>
              </Box>
              {extra && extra}
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
