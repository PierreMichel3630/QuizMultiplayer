import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ThemeShopForm } from "src/form/ThemeShopForm";
import { ThemeShop } from "src/models/Shop";

interface Props {
  theme: ThemeShop | undefined;
  open: boolean;
  close: () => void;
}

export const CreateEditThemeShopDialog = ({ theme, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="h2">
              {theme ? t("commun.edittheme") : t("commun.addtheme")}
            </Typography>
          </Grid>
          <Grid size={12}>
            <ThemeShopForm theme={theme} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
