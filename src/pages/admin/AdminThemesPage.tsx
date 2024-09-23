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
import { useEffect, useMemo, useState } from "react";
import { CreateEditThemeDialog } from "src/component/modal/CreateEditThemeDialog";
import { Colors } from "src/style/Colors";
import { uniqBy } from "lodash";
import { searchString } from "src/utils/string";
import { BasicSearchInput } from "src/component/Input";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";

export default function AdminThemesPage() {
  const { t } = useTranslation();
  const { themesAdmin, getThemes } = useApp();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [maxIndex, setMaxIndex] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const themesDisplay = useMemo(() => {
    setIsLoading(false);
    return uniqBy(
      [...themesAdmin]
        .filter((el) => searchString(search, el.name[language.iso]))
        .sort((a, b) => sortByName(language, a, b)),
      (el) => el.id
    ).splice(0, maxIndex);
  }, [themesAdmin, language, maxIndex, search]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsLoading(true);
      if (
        window.innerHeight + document.documentElement.scrollTop + 1200 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 20);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [themesAdmin, maxIndex]);

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
      {themesDisplay.map((theme) => (
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
      {isLoading && (
        <>
          {Array.from(new Array(10)).map((_, index) => (
            <Grid item xs={12} key={index}>
              <SkeletonCardTheme />
            </Grid>
          ))}
        </>
      )}
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
}
