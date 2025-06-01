import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { useUser } from "src/context/UserProvider";
import { sortByName } from "src/utils/sort";

import AddIcon from "@mui/icons-material/Add";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { selectCategories } from "src/api/category";
import { CardAdminCategory } from "src/component/card/CardCategory";
import { BasicSearchInput } from "src/component/Input";
import { CreateEditCategoryDialog } from "src/component/modal/CreateEditCategoryDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { Category } from "src/models/Category";
import { Colors } from "src/style/Colors";
import { searchString } from "src/utils/string";

export default function AdminEditCategoryPage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [categories, setCategories] = useState<Array<Category>>([]);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [maxIndex, setMaxIndex] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getCategories = useCallback(() => {
    selectCategories().then(({ data }) => {
      const value = data ?? [];
      setCategories(value);
    });
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const categoriesDisplay = useMemo(() => {
    setIsLoading(false);
    return uniqBy(
      [...categories]
        .filter((el) => searchString(search, el.title))
        .sort((a, b) => sortByName(language, a, b)),
      (el) => el.id
    ).splice(0, maxIndex);
  }, [categories, language, maxIndex, search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsLoading(true);
      if (
        window.innerHeight + document.documentElement.scrollTop + 1200 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 20);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [categoriesDisplay, maxIndex]);

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
          onChange={(value) => setSearch(value)}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      {categoriesDisplay.map((category) => (
        <Grid item xs={12} key={category.id}>
          <CardAdminCategory
            category={category}
            onChange={() => {
              getCategories();
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
      <CreateEditCategoryDialog
        category={category}
        open={openModal}
        close={() => {
          setCategory(undefined);
          getCategories();
          setOpenModal(false);
        }}
      />
    </Grid>
  );
}
