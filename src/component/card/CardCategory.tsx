import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Category } from "src/models/Category";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { LanguageIcon } from "../language/LanguageBlock";

interface PropsCardAdminCategory {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export const CardAdminCategory = ({
  category,
  onEdit,
  onDelete,
}: PropsCardAdminCategory) => {
  return (
    <Paper sx={{ p: 1 }} elevation={12}>
      <Grid container spacing={1} alignItems="center">
        <Grid
          size={{
            xs: 2,
            md: 1
          }}>
          <Typography variant="h2">{category.id}</Typography>
        </Grid>
        <Grid size="grow">
          <Box sx={{ display: "flex", gap: 2 }}>
            {category.categorytranslation.map((el, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <LanguageIcon language={el.language} />
                <Typography variant="h4" component="span">
                  {el.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid>
          <IconButton aria-label="edit" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
