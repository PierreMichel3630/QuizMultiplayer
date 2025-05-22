import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { Theme } from "src/models/Theme";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { BasicSearchInput } from "src/component/Input";
import { CreateEditThemeDialog } from "src/component/modal/CreateEditThemeDialog";
import { Colors } from "src/style/Colors";
import { ThemeAdminListScrollBlock } from "../scroll/ThemeScroll";

export const EditTheme = () => {
  const { t } = useTranslation();

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

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
      <Grid item xs={12}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      <Grid item xs={12}>
        <ThemeAdminListScrollBlock
          search={search}
          onSelect={(value) => setTheme(value)}
        />
      </Grid>
      <CreateEditThemeDialog
        theme={theme}
        open={openModal}
        close={() => {
          setTheme(undefined);
          setOpenModal(false);
        }}
      />
    </Grid>
  );
};
