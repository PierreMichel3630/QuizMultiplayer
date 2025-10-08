import { Alert, Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { JsonLanguage } from "src/models/Language";
import { CardImage, ICardImage } from "../card/CardImage";
import { RankingBlock } from "../RankingBlock";
import { TitleBlock } from "../title/Title";
import { useTranslation } from "react-i18next";

interface Props {
  title?: JsonLanguage | string;
  values: Array<ICardImage>;
  addFavorite?: () => void;
  favorite?: boolean;
  isLoading: boolean;
}

export const PageCategoryBlock = ({
  title,
  values,
  addFavorite,
  favorite,
  isLoading = false,
}: Props) => {
  const { t } = useTranslation();

  const idThemes = useMemo(
    () =>
      values.filter((el) => el.type === TypeCardEnum.THEME).map((el) => el.id),
    [values]
  );

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12}>
          {title && (
            <TitleBlock
              title={title}
              addFavorite={addFavorite}
              favorite={favorite}
            />
          )}
        </Grid>
        {isLoading ? (
          <></>
        ) : (
          <>
            {values.length > 0 ? (
              <>
                {idThemes.length > 0 && (
                  <Grid item xs={12}>
                    <RankingBlock themes={idThemes} />
                  </Grid>
                )}
                {values.map((value, index) => (
                  <Grid item key={index}>
                    <CardImage value={value} />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                <Alert severity="warning">{t("alert.noresulttheme")}</Alert>
              </>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
};
