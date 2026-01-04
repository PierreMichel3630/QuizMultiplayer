import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import {
  deleteThemeById,
  selectThemeById,
  selectThemesProposeAdmin,
} from "src/api/theme";
import { Theme } from "src/models/Theme";
import { CardAdminTheme } from "../card/CardTheme";
import { CreateEditThemeDialog } from "../modal/CreateEditThemeDialog";
import { useTranslation } from "react-i18next";
import { useMessage } from "src/context/MessageProvider";
import { ConfirmDialog } from "../modal/ConfirmModal";

export const AdminThemeProposeBlock = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const getThemePropose = () => {
    selectThemesProposeAdmin().then(({ data }) => {
      const res = data ?? [];
      setThemes([...res]);
    });
  };

  useEffect(() => {
    getThemePropose();
  }, []);

  const deleteTheme = () => {
    if (theme) {
      deleteThemeById(theme.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          getThemePropose();
        }
        setOpenConfirmModal(false);
      });
    }
  };

  return (
    <Grid container spacing={1}>
      {themes.map((theme) => (
        <Grid item xs={12} key={theme.id}>
          <CardAdminTheme
            theme={theme}
            onEdit={() => {
              selectThemeById(theme.id).then((res) => {
                const data = res.data ?? (null as unknown as Theme | null);
                setTheme(data);
                setOpenModal(true);
              });
            }}
            onDelete={() => setOpenConfirmModal(true)}
            onChange={() => getThemePropose()}
          />
        </Grid>
      ))}
      <CreateEditThemeDialog
        theme={theme}
        open={openModal}
        close={() => {
          setTheme(null);
          setOpenModal(false);
          getThemePropose();
        }}
      />
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
          getThemePropose();
        }}
        onConfirm={deleteTheme}
      />
    </Grid>
  );
};
