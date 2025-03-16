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
import { CreateEditThemeShopDialog } from "../modal/CreateEditThemeShopDialog";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar } from "src/models/Avatar";
import { CreateEditAvatarDialog } from "../modal/CreateEditAvatarDialog";

interface PropsCardAdminThemeShop {
  theme: ThemeShop;
  onChange: () => void;
}

export const CardAdminThemeShop = ({
  theme,
  onChange,
}: PropsCardAdminThemeShop) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const [openModal, setOpenModal] = useState(false);
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
          <IconButton aria-label="edit" onClick={() => setOpenModal(true)}>
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
      <CreateEditThemeShopDialog
        theme={theme}
        open={openModal}
        close={() => {
          setOpenModal(false);
          onChange();
        }}
      />
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
  onChange: () => void;
}

export const CardAdminAvatar = ({ avatar, onChange }: PropsCardAdminAvatar) => {
  const [openModal, setOpenModal] = useState(false);

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
          <IconButton aria-label="edit" onClick={() => setOpenModal(true)}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
      <CreateEditAvatarDialog
        avatar={avatar}
        open={openModal}
        close={() => {
          onChange();
        }}
      />
    </Paper>
  );
};
