import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { Theme, ThemeUpdate } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
import { updateTheme } from "src/api/theme";
import { useMessage } from "src/context/MessageProvider";
import { LanguageIcon } from "../language/LanguageBlock";
import { ICardImage } from "./CardImage";

interface Props {
  theme: Theme;
  link?: string;
  width?: number;
}

export const CardTheme = ({ theme, link, width = 95 }: Props) => {
  const navigate = useNavigate();
  const { favorites } = useApp();

  const goTheme = () => {
    navigate(link ?? `/theme/${theme.id}`);
  };

  const isFavorite = useMemo(
    () => favorites.some((favorite) => favorite.theme === theme.id),
    [favorites, theme]
  );

  return (
    <Box
      onClick={() => goTheme()}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        borderRadius: px(10),
        gap: px(2),
        mt: 1,
        width: width,
        position: "relative",
      }}
    >
      <ImageThemeBlock theme={theme} size={width} />
      <Typography
        variant="h6"
        sx={{
          width: percent(100),
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          textAlign: "center",
        }}
      >
        {theme.title}
      </Typography>
      {isFavorite && (
        <StarIcon
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            transform: "translate(25%, -25%)",
            fontSize: 40,
            color: Colors.yellow4,
            stroke: Colors.white,
          }}
        />
      )}
    </Box>
  );
};

interface PropsCardSelectAvatarTheme {
  theme: {
    id: number;
    name: string;
    image?: string | JSX.Element;
    color?: string;
  };
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
                <Avatar
                  key={index}
                  src={a}
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: "background.paper",
                  }}
                />
              ))}
            </AvatarGroup>
          )
        }
      >
        <ImageThemeBlock theme={theme} size={width} />
      </Badge>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        {theme.name}
      </Typography>
    </Box>
  );
};

interface PropsCardSelectTheme {
  theme: { name: string; image?: string | JSX.Element; color?: string };
  onSelect: () => void;
  width?: number;
}

export const CardSelectTheme = ({
  theme,
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
        borderRadius: px(5),
        gap: px(5),
        position: "relative",
        height: percent(100),
      }}
    >
      <ImageThemeBlock theme={theme} size={width} />
      <Typography
        variant="h6"
        sx={{
          width: percent(100),
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          textAlign: "center",
        }}
      >
        {theme.name}
      </Typography>
    </Box>
  );
};

interface PropsCardAdminTheme {
  theme: Theme;
  onChange: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CardAdminTheme = ({
  theme,
  onChange,
  onDelete,
  onEdit,
}: PropsCardAdminTheme) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const changeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    update({ id: theme.id, enabled: event.target.checked });
  };

  const changeValidate = (event: ChangeEvent<HTMLInputElement>) => {
    update({ id: theme.id, validate: event.target.checked });
  };

  const update = (value: ThemeUpdate) => {
    updateTheme(value).then((res) => {
      if (res.error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        onChange();
      }
    });
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item sx={{ width: px(50) }}>
          <Typography variant="h2">{theme.id}</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ width: px(60) }}>
            <ImageThemeBlock theme={theme} />
          </Box>
        </Grid>
        <Grid item xs>
          <Box sx={{ display: "flex", gap: 2 }}>
            {theme.themetranslation.map((el, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <LanguageIcon language={el.language} />
                <Typography variant="h4" component="span">
                  {el.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={theme.enabled}
                  onChange={changeEnabled}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={t("commun.enabled")}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={theme.validate}
                  onChange={changeValidate}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={t("commun.validation")}
            />
          </FormGroup>
        </Grid>
        <Grid item>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="edit" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface PropsCardThemeHorizontal {
  theme: ICardImage;
  width?: number;
  onChange: () => void;
}

export const CardThemeHorizontal = ({
  theme,
  width = 50,
  onChange,
}: PropsCardThemeHorizontal) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: px(5),
        cursor: "pointer",
        justifyContent: "space-between",
        backgroundColor: Colors.grey,
      }}
      onClick={() => onChange()}
    >
      <ImageThemeBlock theme={theme} size={width} />
      <Typography variant="h2">{theme.name}</Typography>
      <DeleteIcon
        sx={{ cursor: "pointer" }}
        fontSize="large"
        onClick={(event) => {
          event.stopPropagation();
          onChange();
        }}
      />
    </Paper>
  );
};
