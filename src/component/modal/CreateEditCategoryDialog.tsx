import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CategoryForm } from "src/form/CategoryForm";
import { Category } from "src/models/Category";

interface Props {
  category: Category | null;
  open: boolean;
  close: () => void;
}

export const CreateEditCategoryDialog = ({ category, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="h2">
              {category ? t("commun.editcategory") : t("commun.addcategory")}
            </Typography>
          </Grid>
          <Grid size={12}>
            <CategoryForm category={category} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
