import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { GameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";
import CloseIcon from "@mui/icons-material/Close";
import { ProfileTitleBlock } from "src/component/title/ProfileTitle";
import { CountryBlock } from "src/component/CountryBlock";
import { px } from "csx";

interface Props {
  data?: GameModeScore;
  fixed?: number;
  unit?: string;
  open: boolean;
  close: () => void;
}

export const ReactionTimeDetailDialog = ({ data, open, close }: Props) => {
  const { t } = useTranslation();
  const attempts: Array<number> = useMemo(
    () => data?.extra?.attempts ?? [],
    [data],
  );

  const extra = useMemo(
    () => (
      <List>
        {attempts.map((attempt, i) => (
          <Fragment key={i}>
            <ListItem>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography>
                  {t("gamemode.reactiontime.attempt")} {i + 1} :
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {attempt} ms
                </Typography>
              </Box>
            </ListItem>
            <Divider sx={{ margin: 0 }} variant="inset" component="li" />
          </Fragment>
        ))}
      </List>
    ),
    [attempts, t],
  );

  return (
    <GameModeDialog
      data={data}
      open={open}
      close={close}
      extra={extra}
      fixed={2}
      unit="ms"
    />
  );
};

interface PropsExtra extends Props {
  extra?: JSX.Element;
}

export const GameModeDialog = ({
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
          <Grid container spacing={1}>
            <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
              <AvatarAccountBadge
                profile={data.profile}
                size={100}
                color={Colors.pink}
              />
            </Grid>
            {data.profile.country && (
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CountryBlock
                  country={data.profile.country}
                  color="text.secondary"
                />
              </Grid>
            )}
            <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h2"
                color="text.secondary"
                sx={{
                  textShadow: "1px 1px 2px black",
                }}
              >
                {data.profile.username}
              </Typography>
            </Grid>
            <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
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
                <Typography variant="body1">{t("commun.average")} :</Typography>
                <Typography variant="h6">
                  {data.average?.toFixed(fixed)} {unit}
                </Typography>
              </Box>
            </Grid>
            {extra && <Grid size={12}>{extra}</Grid>}
            <Grid
              size={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: px(5),
              }}
            >
              <Typography variant="subtitle1">
                {t("gamemode.record")} :
              </Typography>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {data.score?.toFixed(fixed)} {unit}
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
