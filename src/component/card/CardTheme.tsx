import {
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
}

export const CardTheme = ({ theme, link }: Props) => {
  const navigate = useNavigate();

  const goTheme = () => {
    navigate(link ? link : `/theme/${theme.id}`);
  };

  return (
    <Box
      onClick={() => goTheme()}
      sx={{
        width: percent(100),
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(2),
      }}
    >
      <ImageThemeBlock theme={theme} size={90} />
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
}

export const CardSelectTheme = ({
  theme,
  select,
  onSelect,
}: PropsCardSelectTheme) => {
  return (
    <Box
      onClick={() => onSelect()}
      sx={{
        width: percent(100),
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        p: px(5),
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(5),
        position: "relative",
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
      <ImageThemeBlock theme={theme} size={90} />
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
