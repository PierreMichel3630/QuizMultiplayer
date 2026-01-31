import { Alert, Box, Grid } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { CardImage, ICardImage } from "../card/CardImage";
import { RankingBlock } from "../RankingBlock";
import { SkeletonThemesGrid } from "../skeleton/SkeletonTheme";
import { TitleBlock } from "../title/Title";

interface Props {
  title?: JSX.Element | string;
  values: Array<ICardImage>;
  addFavorite?: () => void;
  favorite?: boolean;
  count?: number;
  isLoading: boolean;
  handleScroll?: () => void;
}

export const PageCategoryBlock = ({
  title,
  values,
  addFavorite,
  favorite,
  count,
  isLoading = false,
  handleScroll,
}: Props) => {
  const { t } = useTranslation();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const idThemes = useMemo(
    () =>
      values.filter((el) => el.type === SearchType.THEME).map((el) => el.id),
    [values]
  );

  const isEnd = useMemo(
    () => (count ? values.length >= count : true),
    [count, values.length]
  );

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd && handleScroll) {
        handleScroll();
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [isLoading, isEnd, handleScroll]);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        <Grid size={12}>
          {title && (
            <TitleBlock
              title={title}
              addFavorite={addFavorite}
              favorite={favorite}
            />
          )}
        </Grid>
        {idThemes.length > 0 && (
          <Grid size={12}>
            <RankingBlock themes={idThemes} />
          </Grid>
        )}
        {values.map((value, index) => (
          <Grid
            key={index}
            ref={index === values.length - 1 ? lastItemRef : null}
          >
            <CardImage value={value} />
          </Grid>
        ))}
        {isLoading && <SkeletonThemesGrid number={6} />}
        {values.length === 0 && !isLoading && (
          <Alert severity="warning">{t("alert.noresulttheme")}</Alert>
        )}
      </Grid>
    </Box>
  );
};
