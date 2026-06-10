import { Dialog, DialogContent, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ProposeThemeForm } from "src/form/ProposeThemeForm";
import { TitleModal } from "./commun/TitleModal";

interface Props {
  open: boolean;
  close: () => void;
}

export const ProposeThemeModal = ({ open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open} maxWidth="sm" fullWidth>
      <TitleModal title={t("commun.proposetheme")} close={close} />
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <ProposeThemeForm validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
