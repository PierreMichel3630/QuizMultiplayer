import BoltIcon from "@mui/icons-material/Bolt";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMessage } from "src/context/MessageProvider";
import { Category } from "src/models/Category";
import { Colors } from "src/style/Colors";
import { ConfirmDialog } from "../modal/ConfirmModal";
import { CreateEditCategoryDialog } from "../modal/CreateEditCategoryDialog";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteCategoryById } from "src/api/category";
import { LanguageBlock } from "../language/LanguageBlock";

interface Props {
  category: Category;
  link?: string;
  width?: number;
}

export const CardCategory = ({ category, link, width = 90 }: Props) => {
  const navigate = useNavigate();

  const goCategory = () => {
    navigate(link ?? `/category/${category.id}`);
  };

  return (
    <Box
      onClick={() => goCategory()}
      sx={{
        width: width,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        cursor: "pointer",
        borderRadius: px(10),
        gap: px(2),
      }}
    >
      <Box
        sx={{
          backgroundColor: Colors.colorApp,
          width: width,
          aspectRatio: "1/1",
          borderRadius: px(5),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BoltIcon
          sx={{ width: px(width - 10), height: px(width - 10), color: "white" }}
        />
      </Box>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        {category.title}
      </Typography>
    </Box>
  );
};

interface PropsCardAdminCategory {
  category: Category;
  onChange: () => void;
}

export const CardAdminCategory = ({
  category,
  onChange,
}: PropsCardAdminCategory) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const deleteCategory = () => {
    deleteCategoryById(category.id).then((res) => {
      if (res.error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        onChange();
      }
      setOpenConfirmModal(false);
    });
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2} md={1}>
          <Typography variant="h2">{category.id}</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" component="span">
            {category.title}
          </Typography>
          <LanguageBlock iso={category.language} />
        </Grid>
        <Grid item>
          <IconButton aria-label="edit" onClick={() => setOpenModal(true)}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="edit"
            onClick={() => setOpenConfirmModal(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <CreateEditCategoryDialog
        category={category}
        open={openModal}
        close={() => {
          setOpenModal(false);
          onChange();
        }}
      />
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteCategory}
      />
    </Paper>
  );
};
