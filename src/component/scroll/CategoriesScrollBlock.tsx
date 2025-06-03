import { Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { searchCategories } from "src/api/category";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { CategoryWithThemeBlock } from "../CategoryWithThemeBlock";
import { SkeletonCategories } from "../skeleton/SkeletonCategory";
import InfiniteScroll from "react-infinite-scroll-component";
import { CardAdminCategory } from "../card/CardCategory";

export const CategoriesScrollBlock = () => {
  const { language } = useUser();

  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const getCategories = useCallback(
    (page: number) => {
      if (loading) return;
      setLoading(true);
      const itemperpage = 5;
      if (!isEnd) {
        searchCategories("", page, itemperpage, [language.iso]).then(
          ({ data }) => {
            const result: Array<Category> = data ?? [];
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
  }, []);

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

interface PropsCategoriesAdminListScrollBlock {
  search: string;
  languages: Array<string>;
  onSelect: (value: Category) => void;
}

export const CategoriesAdminListScrollBlock = ({
  search,
  languages,
  onSelect,
}: PropsCategoriesAdminListScrollBlock) => {
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const getCategories = useCallback(
    (page: number) => {
      const itemperpage = 30;
      if (!isEnd) {
        searchCategories(search, page, itemperpage, languages).then(
          ({ data }) => {
            const result = data ?? [];
            setIsEnd(result.length < itemperpage);
            setCategories((prev) => [...prev, ...result]);
          }
        );
      }
    },
    [isEnd, search, languages]
  );

  useEffect(() => {
    setPage(0);
    setIsEnd(false);
    setCategories([]);
  }, [search, languages]);

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
      loader={undefined}
    >
      <Grid container spacing={1} justifyContent="center">
        {categories.map((item, index) => (
          <Grid item xs={12} key={index} onClick={() => onSelect(item)}>
            <CardAdminCategory
              category={item}
              onChange={() => {
                setPage(0);
                setIsEnd(false);
                setCategories([]);
                getCategories(0);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};
