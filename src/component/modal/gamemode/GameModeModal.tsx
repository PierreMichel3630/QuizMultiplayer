import CloseIcon from "@mui/icons-material/Close";
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
import { percent, px } from "csx";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { CountryBlock } from "src/component/CountryBlock";
import { ProfileTitleBlock } from "src/component/title/ProfileTitle";
import { GameModeScore } from "src/models/GameMode";
import { TargetResult } from "src/pages/modes/braintest/games/AimPage";
import { Colors } from "src/style/Colors";
import { scaleToMax } from "src/utils/scale";

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
                  {attempt.toFixed(2)} ms
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

export const AimDetailDialog = ({ data, open, close }: Props) => {
  const { t } = useTranslation();

  const extraValue: {
    width?: number;
    height?: number;
    targets: Array<TargetResult>;
  } = useMemo(() => data?.extra, [data]);

  const previewSize = useMemo(
    () =>
      extraValue?.width && extraValue?.height
        ? scaleToMax({
            width: extraValue.width ?? 100,
            height: extraValue.height ?? 100,
          })
        : undefined,
    [extraValue],
  );

  const previewSizeGlobal = useMemo(
    () =>
      extraValue?.width && extraValue?.height
        ? scaleToMax(
            {
              width: extraValue.width ?? 100,
              height: extraValue.height ?? 100,
            },
            400,
          )
        : undefined,
    [extraValue],
  );

  const extra = useMemo(
    () =>
      extraValue && (
        <Grid container spacing={1}>
          {extraValue.width && extraValue.height && (
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Typography variant="body1" component="span">
                {t("gamemode.aimtrainer.screensize")} :
              </Typography>
              <Typography variant="h6" component="span">
                {"  "}
                {extraValue.width} x {extraValue.height}
              </Typography>
            </Grid>
          )}
          {extraValue.targets !== undefined &&
            previewSize &&
            extraValue?.width !== undefined &&
            extraValue?.height !== undefined && (
              <>
                {extraValue.targets.map((target, i) => {
                  const left =
                    (target.x / extraValue.width!) * previewSize.width;
                  const top =
                    (target.y / extraValue.height!) * previewSize.height;
                  return (
                    <Fragment key={i}>
                      <Grid size={12}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h4">
                              {t("gamemode.aimtrainer.target")} {i + 1}
                            </Typography>
                            <Box>
                              <Typography component="span">
                                {t("commun.position")} :
                              </Typography>
                              <Typography variant="h6" component="span">
                                {"  "}
                                {target.x.toFixed(2)} x {target.y.toFixed(2)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography component="span">
                                {t("commun.time")} :
                              </Typography>
                              <Typography variant="h6" component="span">
                                {"  "} {target.time.toFixed(2)} ms
                              </Typography>
                            </Box>
                          </Box>
                          {extraValue.width && extraValue.height && (
                            <Box
                              sx={{
                                position: "relative",
                                width: previewSize.width,
                                height: previewSize.height,
                                border: "1px solid #ccc",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: left,
                                  top: top,
                                  borderRadius: percent(50),
                                  backgroundColor: Colors.red,
                                  width: 80 * previewSize.scale,
                                  height: 80 * previewSize.scale,
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid size={12}>
                        <Divider />
                      </Grid>
                    </Fragment>
                  );
                })}
              </>
            )}

          {previewSizeGlobal && extraValue.targets && (
            <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: previewSizeGlobal.width,
                  height: previewSizeGlobal.height,
                  border: "1px solid #ccc",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {extraValue.targets.map((target, i) => {
                  const left =
                    (target.x / extraValue.width!) * previewSizeGlobal.width;
                  const top =
                    (target.y / extraValue.height!) * previewSizeGlobal.height;
                  return (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        left: left,
                        top: top,
                        borderRadius: percent(50),
                        backgroundColor: Colors.red,
                        width: 80 * previewSizeGlobal.scale,
                        height: 80 * previewSizeGlobal.scale,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">{i + 1}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          )}
        </Grid>
      ),
    [extraValue, previewSize, previewSizeGlobal, t],
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
