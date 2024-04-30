import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { updateTheme } from "src/api/theme";
import { ButtonColor } from "src/component/Button";
import { CardAdminTheme } from "src/component/card/CardTheme";
import { useApp } from "src/context/AppProvider";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Theme, ThemeUpdate } from "src/models/Theme";
import { sortByName } from "src/utils/sort";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { CreateEditThemeDialog } from "src/component/modal/CreateEditThemeDialog";
import { Colors } from "src/style/Colors";

export const AdminThemesPage = () => {
  const { t } = useTranslation();
  const { themesAdmin, getThemes } = useApp();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  const update = (value: ThemeUpdate) => {
    updateTheme(value).then((res) => {
      if (res.error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        getThemes();
      }
    });
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <ButtonColor
          icon={AddIcon}
          label={t("commun.addtheme")}
          value={Colors.green}
          onClick={() => setOpenModal(true)}
          variant="contained"
        />
      </Grid>
      {themesAdmin
        .sort((a, b) => sortByName(language, a, b))
        .map((theme) => (
          <Grid item xs={12} key={theme.id}>
            <CardAdminTheme
              theme={theme}
              onChange={update}
              edit={() => {
                setTheme(theme);
                setOpenModal(true);
              }}
            />
          </Grid>
        ))}
      <CreateEditThemeDialog
        theme={theme}
        open={openModal}
        close={() => {
          setTheme(undefined);
          getThemes();
          setOpenModal(false);
        }}
      />
    </Grid>
  );
};
