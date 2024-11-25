import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Grid,
  IconButton,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import { Theme, ThemeUpdate } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Colors } from "src/style/Colors";
import { ChangeEvent } from "react";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  theme: Theme;
  link?: string;
  width?: number;
}

export const CardTheme = ({ theme, link, width = 92 }: Props) => {
  const navigate = useNavigate();

  const goTheme = () => {
    navigate(link ? link : `/theme/${theme.id}`);
  };

  return (
    <Box
      onClick={() => goTheme()}
      sx={{
        width: width,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        cursor: "pointer",
        borderRadius: px(10),
        gap: px(2),
      }}
    >
      <ImageThemeBlock theme={theme} size={width} />
      <JsonLanguageBlock
        variant="h6"
        sx={{ textAlign: "center" }}
        value={theme.name}
      />
    </Box>
  );
};

interface PropsCardSelectAvatarTheme {
  theme: Theme;
  avatars: Array<{ id: number; avatars: Array<string> }>;
  onSelect: () => void;
  width?: number;
}

export const CardSelectAvatarTheme = ({
  theme,
  avatars,
  onSelect,
  width = 80,
}: PropsCardSelectAvatarTheme) => {
  const avatarsTheme = avatars.find((el) => el.id === theme.id);
  return (
    <Box
      onClick={() => onSelect()}
      sx={{
        maxWidth: width + 10,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        cursor: "pointer",
        p: px(5),
        mt: px(9),
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(5),
        position: "relative",
      }}
    >
      <Badge
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        badgeContent={
          avatarsTheme && (
            <AvatarGroup
              max={2}
              sx={{
                "& .MuiAvatar-root": { width: 30, height: 30, fontSize: 15 },
                mr: 3,
              }}
            >
              {avatarsTheme.avatars.map((a, index) => (
                <Avatar key={index} src={a} sx={{ width: 30, height: 30 }} />
              ))}
            </AvatarGroup>
          )
        }
      >
        <ImageThemeBlock theme={theme} size={width} />
      </Badge>
      <JsonLanguageBlock
        variant="h6"
        sx={{ textAlign: "center" }}
        value={theme.name}
      />
    </Box>
  );
};

interface PropsCardSelectTheme {
  theme: Theme;
  select: boolean;
  onSelect: () => void;
  width?: number;
}

export const CardSelectTheme = ({
  theme,
  select,
  onSelect,
  width = 80,
}: PropsCardSelectTheme) => {
  return (
    <Box
      onClick={() => onSelect()}
      sx={{
        maxWidth: width + 10,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        cursor: "pointer",
        p: px(5),
        mt: px(5),
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(5),
        position: "relative",
        height: percent(100),
      }}
    >
      {select && (
        <CheckCircleTwoToneIcon
          sx={{
            color: Colors.green2,
            position: "absolute",
            backgroundColor: "white",
            borderRadius: percent(50),
            top: 0,
            right: 0,
            transform: "translate(30%, -30%)",
          }}
        />
      )}
      <ImageThemeBlock theme={theme} size={width} />
      <JsonLanguageBlock
        variant="h6"
        sx={{ textAlign: "center" }}
        value={theme.name}
      />
    </Box>
  );
};

interface PropsCardAdminTheme {
  theme: Theme;
  onChange: (theme: ThemeUpdate) => void;
  edit: () => void;
}

export const CardAdminTheme = ({
  theme,
  onChange,
  edit,
}: PropsCardAdminTheme) => {
  const changeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ id: theme.id, enabled: event.target.checked });
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Box sx={{ width: px(50) }}>
            <ImageThemeBlock theme={theme} />
          </Box>
        </Grid>
        <Grid
          item
          xs
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="h2">{theme.id}</Typography>
          <JsonLanguageBlock variant="h4" component="span" value={theme.name} />
        </Grid>
        <Grid item>
          <Switch
            checked={theme.enabled}
            onChange={changeEnabled}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Grid>
        <Grid item>
          <IconButton aria-label="edit" onClick={edit}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
