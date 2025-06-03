import { Avatar, Chip, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { Theme } from "src/models/Theme";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { BasicSearchInput } from "src/component/Input";
import { CreateEditThemeDialog } from "src/component/modal/CreateEditThemeDialog";
import { ThemeAdminListScrollBlock } from "src/component/scroll/ThemeScroll";
import { LANGUAGES, LANGUAGESDEFAULT } from "src/models/Language";
import { Colors } from "src/style/Colors";

export default function AdminEditThemePage() {
  const { t } = useTranslation();

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [languages, setLanguages] = useState([LANGUAGESDEFAULT.iso]);

  const selectLanguage = (language: string) => {
    const isSelect = languages.find((el) => el === language);
    if (isSelect) {
      setLanguages((prev) => [...prev].filter((el) => el !== language));
    } else {
      setLanguages((prev) => [...prev, language]);
    }
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
      <Grid item xs={12}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", gap: 1, justifyContent: "center" }}
      >
        {LANGUAGES.map((lang, index) => {
          const isSelect = languages.find((el) => el === lang.iso);
          return (
            <Chip
              key={index}
              variant={isSelect ? "filled" : "outlined"}
              color={isSelect ? "success" : "default"}
              avatar={<Avatar src={lang.icon} />}
              label={lang.name}
              onClick={() => selectLanguage(lang.iso)}
            />
          );
        })}
      </Grid>
      <Grid item xs={12}>
        <ThemeAdminListScrollBlock
          search={search}
          languages={languages}
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
}
