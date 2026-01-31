import { Box, Grid, Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { Theme } from "src/models/Theme";

import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import {
  countThemes,
  deleteThemeById,
  searchThemes,
  selectThemeById,
} from "src/api/theme";
import { CardAdminTheme } from "src/component/card/CardTheme";
import { BasicSearchInput } from "src/component/Input";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { CreateEditThemeDialog } from "src/component/modal/CreateEditThemeDialog";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

export default function AdminEditThemePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const ITEMPERPAGE = 20;

  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(1);
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const deleteTheme = () => {
    if (theme) {
      deleteThemeById(theme.id).then((res) => {
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
      countThemes(language, search).then(({ count }) => {
        setCount(count ?? 0);
      });
    }
  }, [language, search]);

  useEffect(() => {
    getCount();
  }, [getCount]);

  const getPage = useCallback(() => {
    setThemes([]);
    setTheme(null);
    if (page !== null && language) {
      searchThemes(language, search, page - 1, ITEMPERPAGE).then(({ data }) => {
        const result = (data ?? []) as unknown as Array<Theme>;
        setThemes(result);
      });
    }
  }, [page, search, language]);

  useEffect(() => {
    getPage();
  }, [getPage]);

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
      <Grid size={12}>
        <Grid container spacing={1} justifyContent="center">
          {themes.map((item) => (
            <Grid key={item.id} onClick={() => {}} size={12}>
              <CardAdminTheme
                theme={item}
                onEdit={() => {
                  selectThemeById(item.id).then((res) => {
                    const data = res.data ?? (null as unknown as Theme | null);
                    setTheme(data);
                    setOpenModal(true);
                  });
                }}
                onDelete={() => setOpenConfirmModal(true)}
                onChange={() => getPage()}
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
      <CreateEditThemeDialog
        theme={theme}
        open={openModal}
        close={() => {
          setTheme(null);
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
        onConfirm={deleteTheme}
      />
    </Grid>
  );
}
