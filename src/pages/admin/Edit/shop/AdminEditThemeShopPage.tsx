import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";

import AddIcon from "@mui/icons-material/Add";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { selectShopTheme } from "src/api/shop";
import { CardAdminThemeShop } from "src/component/card/CardAdmin";
import { BasicSearchInput } from "src/component/Input";
import { CreateEditThemeShopDialog } from "src/component/modal/CreateEditThemeShopDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { ShopTheme } from "src/models/Shop";
import { Colors } from "src/style/Colors";
import { searchString } from "src/utils/string";

export default function AdminEditThemeShopPage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [themes, setThemes] = useState<Array<ShopTheme>>([]);
  const [theme, setTheme] = useState<ShopTheme | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const themesShopDisplay = useMemo(() => {
    setIsLoading(false);
    return uniqBy(
      [...themes]
        .filter((el) => searchString(search, el.name[language.iso]))
        .sort((a, b) => sortByName(language, a, b)),
      (el) => el.id
    );
  }, [themes, language, search]);

  useEffect(() => {
    getThemes();
  }, []);

  const getThemes = () => {
    selectShopTheme().then(({ data }) => {
      setThemes(data ?? []);
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
      <Grid item xs={12}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      {themesShopDisplay.map((theme) => (
        <Grid item xs={12} key={theme.id}>
          <CardAdminThemeShop
            theme={theme}
            onChange={() => {
              getThemes();
            }}
            onEdit={() => {
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
      <CreateEditThemeShopDialog
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
