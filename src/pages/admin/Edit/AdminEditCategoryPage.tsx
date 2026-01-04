import { Box, Grid, Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";

import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import {
  countCategory,
  deleteCategoryById,
  searchCategories,
  selectCategoryById,
} from "src/api/category";
import { CardAdminCategory } from "src/component/card/CardCategory";
import { BasicSearchInput } from "src/component/Input";
import { CreateEditCategoryDialog } from "src/component/modal/CreateEditCategoryDialog";
import { Category } from "src/models/Category";
import { Colors } from "src/style/Colors";
import { useUser } from "src/context/UserProvider";
import { useMessage } from "src/context/MessageProvider";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";

export default function AdminEditCategoryPage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const ITEMPERPAGE = 20;

  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(1);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const deleteCategory = () => {
    if (category) {
      deleteCategoryById(category.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          getPage();
        }
        setOpenConfirmModal(false);
      });
    }
  };

  const getCount = useCallback(() => {
    if (language) {
      countCategory(language, search).then(({ count }) => {
        setCount(count ?? 0);
      });
    }
  }, [language, search]);

  useEffect(() => {
    getCount();
  }, [getCount]);

  const getPage = useCallback(() => {
    setCategories([]);
    setCategory(null);
    if (page !== null && language) {
      searchCategories(language, search, page - 1, ITEMPERPAGE).then(
        ({ data }) => {
          const result = (data ?? []) as unknown as Array<Category>;
          setCategories(result);
        }
      );
    }
  }, [page, search, language]);

  useEffect(() => {
    getPage();
  }, [getPage]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <ButtonColor
          icon={AddIcon}
          label={t("commun.addcategory")}
          value={Colors.green}
          onClick={() => setOpenModal(true)}
          variant="contained"
        />
      </Grid>
      <Grid item xs={12}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          value={search}
          clear={() => {
            setSearch("");
            setPage(1);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} justifyContent="center">
          {categories.map((item) => (
            <Grid item xs={12} key={item.id} onClick={() => {}}>
              <CardAdminCategory
                category={item}
                onEdit={() => {
                  selectCategoryById(item.id).then((res) => {
                    const data =
                      res.data ?? (null as unknown as Category | null);
                    setCategory(data);
                    setOpenModal(true);
                  });
                }}
                onDelete={() => setOpenConfirmModal(true)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          left: 5,
          right: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {page !== null && (
          <Pagination
            count={count ? Math.ceil(count / ITEMPERPAGE) : 1}
            page={page}
            onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
              setPage(value)
            }
            variant="outlined"
            shape="rounded"
            sx={{
              backgroundColor: "background.paper",
            }}
          />
        )}
      </Box>
      <CreateEditCategoryDialog
        category={category}
        open={openModal}
        close={() => {
          setCategory(null);
          setOpenModal(false);
          getPage();
        }}
      />
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
          getPage();
        }}
        onConfirm={deleteCategory}
      />
    </Grid>
  );
}
