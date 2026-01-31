import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BannerForm } from "src/form/admin/BannerForm";
import { Banner } from "src/models/Banner";

interface Props {
  banner?: Banner;
  open: boolean;
  close: () => void;
}

export const CreateEditBannerDialog = ({ banner, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="h2">
              {banner ? t("commun.editbanner") : t("commun.addbanner")}
            </Typography>
          </Grid>
          <Grid size={12}>
            <BannerForm banner={banner} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
