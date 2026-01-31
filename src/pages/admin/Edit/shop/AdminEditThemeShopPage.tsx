import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";

import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { selectThemeShop } from "src/api/shop";
import { CardAdminThemeShop } from "src/component/card/CardAdmin";
import { BasicSearchInput } from "src/component/Input";
import { CreateEditThemeShopDialog } from "src/component/modal/CreateEditThemeShopDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { ThemeShop } from "src/models/Shop";
import { Colors } from "src/style/Colors";

export default function AdminEditThemeShopPage() {
  const { t } = useTranslation();

  const [themesShop, setThemesShop] = useState<Array<ThemeShop>>([]);
  const [theme, setTheme] = useState<ThemeShop | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getThemes();
  }, []);

  const getThemes = () => {
    setIsLoading(true);
    selectThemeShop().then(({ data }) => {
      setThemesShop(data ?? []);
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <ButtonColor
          icon={AddIcon}
          label={t("commun.addtheme")}
          value={Colors.green}
          onClick={() => setOpenModal(true)}
          variant="contained"
        />
      </Grid>
      <Grid size={12}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      {themesShop.map((theme) => (
        <Grid key={theme.id} size={12}>
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
            <Grid key={index} size={12}>
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
