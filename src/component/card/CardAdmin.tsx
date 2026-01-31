import {
  Box,
  Grid,
  IconButton,
  Avatar as MuiAvatar,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteThemeShopById } from "src/api/shop";
import { useMessage } from "src/context/MessageProvider";
import { ConfirmDialog } from "../modal/ConfirmModal";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { px } from "csx";
import { Avatar } from "src/models/Avatar";
import { Banner } from "src/models/Banner";
import { ThemeShop } from "src/models/Shop";
import { Title } from "src/models/Title";
import { LanguageIcon } from "../language/LanguageBlock";

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
    deleteThemeShopById(theme.id).then((res) => {
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
        <Grid>
          <Typography variant="h2">{theme.id}</Typography>
        </Grid>
        <Grid sx={{ display: "flex", gap: px(5) }} size="grow">
          {theme.themeshoptranslation.map((el, index) => (
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
        <Grid>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid>
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
        <Grid size="grow">
          <Typography variant="h2">{avatar.id}</Typography>
        </Grid>
        <Grid size="grow">
          <MuiAvatar
            sx={{
              width: 60,
              height: 60,
            }}
            src={avatar.icon}
          />
        </Grid>
        <Grid size="grow">
          <Typography variant="h4">{avatar.price}</Typography>
        </Grid>
        <Grid size="grow">
          <Typography variant="h4">
            {avatar.isaccomplishment.toString()}
          </Typography>
        </Grid>
        <Grid>
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
        <Grid size="grow">
          <Typography variant="h2">{banner.id}</Typography>
        </Grid>
        <Grid size="grow">
          <img alt="banner" width={200} src={banner.src} />
        </Grid>
        <Grid size="grow">
          <Typography variant="h4">{banner.price}</Typography>
        </Grid>
        <Grid size="grow">
          <Typography variant="h4">
            {banner.isaccomplishment.toString()}
          </Typography>
        </Grid>
        <Grid>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface PropsCardAdminTitle {
  title: Title;
  onEdit: () => void;
}

export const CardAdminTitle = ({ title, onEdit }: PropsCardAdminTitle) => {
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid>
          <Typography variant="h2">{title.id}</Typography>
        </Grid>
        <Grid sx={{ display: "flex", gap: px(5) }} size="grow">
          {title.titletranslation.map((el, index) => (
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
        <Grid>
          <Typography variant="h4">{title.price}</Typography>
        </Grid>
        <Grid>
          <Typography variant="h4">
            {title.isaccomplishment.toString()}
          </Typography>
        </Grid>
        <Grid>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
