import { Grid } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { CategoryWithThemeBlock } from "../CategoryWithThemeBlock";
import { SkeletonCategories } from "../skeleton/SkeletonCategory";
import { useCallback, useEffect, useState } from "react";
import { Category } from "src/models/Category";
import { searchCategories } from "src/api/category";

export const CategoriesScrollBlock = () => {
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const getCategories = useCallback(
    (page: number) => {
      const itemperpage = 5;
      if (!isEnd) {
        searchCategories("", page, itemperpage).then(({ data }) => {
          const result = data ?? [];
          setIsEnd(result.length < itemperpage);
          setCategories((prev) => [...prev, ...result]);
        });
      }
    },
    [isEnd]
  );

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getCategories(nextPage);
      return nextPage;
    });
  };

  useEffect(() => {
    getCategories(0);
  }, [getCategories]);

  return (
    <InfiniteScroll
      dataLength={categories.length}
      next={handleLoadMoreData}
      hasMore={!isEnd}
      loader={<SkeletonCategories number={2} />}
    >
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {categories.map((category) => (
          <Grid item xs={12} key={category.id}>
            <CategoryWithThemeBlock category={category} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};
