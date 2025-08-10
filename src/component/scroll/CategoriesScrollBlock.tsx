import { Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchCategoriesPaginate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { CategoryWithThemeBlock } from "../CategoryWithThemeBlock";
import { SkeletonCategories } from "../skeleton/SkeletonCategory";

export const CategoriesScrollBlock = () => {
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const getCategories = useCallback(
    (page: number) => {
      if (loading) return;
      if (!isEnd && language) {
        setLoading(true);
        const itemperpage = 5;
        searchCategoriesPaginate(language, "", page, itemperpage).then(
          ({ data }) => {
            const result: Array<any> = data ?? [];
            setIsEnd(result.length < itemperpage);
            setCategories((prev) =>
              page === 0 ? [...result] : [...prev, ...result]
            );
            setLoading(false);
          }
        );
      }
    },
    [isEnd, loading, language]
  );

  useEffect(() => {
    setPage(0);
    setCategories([]);
    setIsEnd(false);
    getCategories(0);
  }, [language]);

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getCategories(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [categories, loading, isEnd, getCategories]);

  return (
    <>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {categories.map((category, index) => (
          <Grid
            item
            xs={12}
            key={category.id}
            ref={index === categories.length - 1 ? lastItemRef : null}
          >
            <CategoryWithThemeBlock category={category} />
          </Grid>
        ))}
      </Grid>
      {!isEnd && <SkeletonCategories number={2} />}
    </>
  );
};
