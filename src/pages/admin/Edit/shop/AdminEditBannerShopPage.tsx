import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";

import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { selectBanners } from "src/api/banner";
import { CardAdminBanner } from "src/component/card/CardAdmin";
import { CreateEditBannerDialog } from "src/component/modal/CreateEditBannerDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { Banner } from "src/models/Banner";
import { Colors } from "src/style/Colors";

export default function AdminEditBannerShopPage() {
  const { t } = useTranslation();

  const [banners, setBanners] = useState<Array<Banner>>([]);
  const [banner, setBanner] = useState<Banner | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = () => {
    selectBanners().then(({ data }) => {
      setBanners(data ?? []);
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <ButtonColor
          icon={AddIcon}
          label={t("commun.addbanner")}
          value={Colors.green}
          onClick={() => setOpenModal(true)}
          variant="contained"
        />
      </Grid>
      {banners.map((banner) => (
        <Grid key={banner.id} size={12}>
          <CardAdminBanner
            banner={banner}
            onEdit={() => {
              setBanner(banner);
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
      <CreateEditBannerDialog
        banner={banner}
        open={openModal}
        close={() => {
          setBanner(undefined);
          getBanners();
          setOpenModal(false);
        }}
      />
    </Grid>
  );
}
