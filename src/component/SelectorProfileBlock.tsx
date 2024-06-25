import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Profile } from "src/models/Profile";

import DeleteIcon from "@mui/icons-material/Delete";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { useTranslation } from "react-i18next";

interface Props {
  label: string;
  profile?: Profile;
  onChange?: () => void;
  onDelete?: () => void;
}

export const SelectorProfileBlock = ({
  label,
  profile,
  onChange,
  onDelete,
}: Props) => {
  return (
    <Box
      sx={{
        height: percent(100),
      }}
    >
      {profile ? (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1,
            cursor: "pointer",
            justifyContent: onDelete ? "space-between" : "center",
            backgroundColor: Colors.lightgrey,
            height: percent(100),
          }}
          onClick={() => {
            if (onChange) {
              onChange();
            }
          }}
        >
          <AvatarAccount avatar={profile.avatar.icon} size={30} />
          <Typography variant="h4" sx={{ wordBreak: "break-all" }}>
            {profile.username}
          </Typography>
          {onDelete && (
            <DeleteIcon
              sx={{ cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete();
              }}
            />
          )}
        </Paper>
      ) : (
        <Button variant="contained" fullWidth onClick={onChange}>
          <Typography variant="h6">{label}</Typography>
        </Button>
      )}
    </Box>
  );
};

interface PropsBattle {
  label: string;
  profile?: Profile;
  onChange?: () => void;
  score: number;
  ready: boolean;
  left?: boolean;
}

export const SelectorProfileBattleBlock = ({
  label,
  profile,
  onChange,
  score,
  ready,
  left = false,
}: PropsBattle) => {
  const { t } = useTranslation();
  return profile ? (
    <Grid
      container
      spacing={1}
      flexDirection={left ? "row-reverse" : "row"}
      alignItems="center"
      alignContent="center"
      justifyContent="center"
    >
      <Grid item>
        <AvatarAccount avatar={profile.avatar.icon} size={50} />
      </Grid>
      <Grid item xs={6} sx={{ textAlign: left ? "left" : "right" }}>
        <Typography
          variant="h6"
          sx={{
            overflow: "hidden",
            display: "block",
            lineClamp: 1,
            boxOrient: "vertical",
            textOverflow: "ellipsis",
          }}
        >
          {profile.username}
        </Typography>
        <Typography variant="h2">{score}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: ready ? Colors.green : Colors.red }}
        >
          {ready ? t("commun.ready") : t("commun.noready")}
        </Typography>
        <Box
          sx={{
            height: px(15),
            width: px(15),
            backgroundColor: ready ? Colors.green : Colors.red,
            borderRadius: percent(50),
          }}
        />
      </Grid>
    </Grid>
  ) : (
    <Button variant="contained" fullWidth onClick={onChange}>
      <Typography variant="h6">{label}</Typography>
    </Button>
  );
};
