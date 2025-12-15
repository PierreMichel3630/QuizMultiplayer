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
import { Theme, ThemeUpdate } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { updateTheme } from "src/api/theme";
import { useMessage } from "src/context/MessageProvider";
import { StatusPropose } from "src/models/enum/Propose";
import { ProposeAlert } from "../alert/ProposeAlert";
import { LanguageIcon } from "../language/LanguageBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";
import { ICardImage } from "./CardImage";

interface PropsCardSelectAvatarTheme {
  theme: ICardImage;
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

interface PropsCardSelectTheme {
  theme: {
    id: number;
    name: string;
    image?: string | JSX.Element;
    color?: string;
  };
  onSelect: () => void;
  width?: number;
  avatars?: Array<{ id: number; avatars: Array<string> }>;
}

export const CardSelectTheme = ({
  theme,
  onSelect,
  width = 80,
  avatars,
}: PropsCardSelectTheme) => {
  const avatarsTheme = useMemo(
    () => (avatars ? avatars.find((el) => el.id === theme.id) : undefined),
    [avatars, theme.id]
  );
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
      {avatarsTheme ? (
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
      ) : (
        <ImageThemeBlock theme={theme} size={width} />
      )}
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
    <Paper sx={{ p: 1 }} elevation={6}>
      <Grid container spacing={1} alignItems="center">
        <Grid item sx={{ width: px(50) }}>
          <Typography variant="h2">{theme.id}</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ width: px(60) }}>
            <ImageThemeBlock theme={theme} />
          </Box>
        </Grid>
        <Grid
          item
          xs
          sx={{ display: "flex", flexDirection: "column", gap: px(5) }}
        >
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

interface PropsCardProposeTheme {
  theme: Theme;
}

export const CardProposeTheme = ({ theme }: PropsCardProposeTheme) => {
  const status = useMemo(() => {
    let value = StatusPropose.INPROGRESS;
    if (theme.enabled && theme.validate) {
      value = StatusPropose.VALIDATE;
    } else if (!theme.enabled) {
      value = StatusPropose.MAINTENANCE;
    }
    return value;
  }, [theme]);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: px(5),
        justifyContent: "space-between",
        backgroundColor: Colors.grey,
      }}
    >
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <ProposeAlert value={status} />
        </Grid>
        <Grid item>
          <ImageThemeBlock theme={theme} size={35} border={false} />
        </Grid>
        <Grid item xs sx={{ textAlign: "center" }}>
          <TextNameBlock
            variant="h4"
            sx={{
              overflow: "hidden",
              display: "block",
              lineClamp: 1,
              boxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
            noWrap
            color="text.secondary"
            values={theme.themetranslation}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
