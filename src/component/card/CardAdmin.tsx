import {
  Grid,
  IconButton,
  Avatar as MuiAvatar,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteShopThemeById } from "src/api/shop";
import { useMessage } from "src/context/MessageProvider";
import { ThemeShop } from "src/models/Theme";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { ConfirmDialog } from "../modal/ConfirmModal";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar } from "src/models/Avatar";
import { Banner } from "src/models/Banner";

interface PropsCardAdminThemeShop {
  theme: ThemeShop;
  onChange: () => void;
  onEdit: () => void;
}

export const CardAdminThemeShop = ({
  theme,
  onChange,
  onEdit,
}: PropsCardAdminThemeShop) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const deleteShopTheme = () => {
    deleteShopThemeById(theme.id).then((res) => {
      if (res.error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        onChange();
      }
      setOpenConfirmModal(false);
    });
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
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
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="edit"
            onClick={() => setOpenConfirmModal(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteShopTheme}
      />
    </Paper>
  );
};

interface PropsCardAdminAvatar {
  avatar: Avatar;
  onEdit: () => void;
}

export const CardAdminAvatar = ({ avatar, onEdit }: PropsCardAdminAvatar) => {
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <Typography variant="h2">{avatar.id}</Typography>
        </Grid>
        <Grid item xs>
          <MuiAvatar
            sx={{
              width: 60,
              height: 60,
            }}
            src={avatar.icon}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h4">{avatar.price}</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="h4">
            {avatar.isaccomplishment.toString()}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface PropsCardAdminBanner {
  banner: Banner;
  onEdit: () => void;
}

export const CardAdminBanner = ({ banner, onEdit }: PropsCardAdminBanner) => {
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <Typography variant="h2">{banner.id}</Typography>
        </Grid>
        <Grid item xs>
          <img alt="banner" width={200} src={banner.src} />
        </Grid>
        <Grid item xs>
          <Typography variant="h4">{banner.price}</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="h4">
            {banner.isaccomplishment.toString()}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
