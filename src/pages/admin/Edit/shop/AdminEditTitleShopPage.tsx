import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";

import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { selectTitles } from "src/api/title";
import { CardAdminTitle } from "src/component/card/CardAdmin";
import { CreateEditTitleDialog } from "src/component/modal/CreateEditTitleDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";

export default function AdminEditTitleShopPage() {
  const { t } = useTranslation();

  const [titles, setTitles] = useState<Array<Title>>([]);
  const [title, setTitle] = useState<Title | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTitles();
  }, []);

  const getTitles = () => {
    selectTitles().then(({ data }) => {
      setTitles(data ?? []);
      setIsLoading(false);
    });
  };

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
      <CreateEditTitleDialog
        title={title}
        open={openModal}
        close={() => {
          setOpenModal(false);
          setTitle(undefined);
          getTitles();
        }}
      />
    </Grid>
  );
}
