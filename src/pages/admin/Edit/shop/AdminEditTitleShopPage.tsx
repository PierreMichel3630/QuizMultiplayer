import { Box, Grid, Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";

import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import { countTitles, searchTitles } from "src/api/title";
import { CardAdminTitle } from "src/component/card/CardAdmin";
import { CreateEditTitleDialog } from "src/component/modal/CreateEditTitleDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";

export default function AdminEditTitleShopPage() {
  const { t } = useTranslation();

  const [titles, setTitles] = useState<Array<Title>>([]);
  const [title, setTitle] = useState<Title | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMPERPAGE = 20;

  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(1);
  const [openModal, setOpenModal] = useState(false);

  const getCount = useCallback(() => {
    countTitles().then(({ count }) => {
      setCount(count ?? 0);
    });
  }, []);

  useEffect(() => {
    getCount();
  }, [getCount]);

  const getPage = useCallback(() => {
    setIsLoading(true);
    setTitles([]);
    setTitle(null);
    if (page !== null) {
      searchTitles(page - 1, ITEMPERPAGE).then(({ data }) => {
        setTitles(data ?? []);
        setIsLoading(false);
      });
    }
  }, [page]);

  useEffect(() => {
    getPage();
  }, [getPage]);

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <ButtonColor
          icon={AddIcon}
          label={t("commun.addtitle")}
          value={Colors.green}
          onClick={() => setOpenModal(true)}
          variant="contained"
        />
      </Grid>
      {titles.map((title) => (
        <Grid item xs={12} key={title.id}>
          <CardAdminTitle
            title={title}
            onEdit={() => {
              setTitle(title);
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
      <CreateEditTitleDialog
        title={title}
        open={openModal}
        close={() => {
          setTitle(null);
          setOpenModal(false);
          getPage();
        }}
      />
    </Grid>
  );
}
