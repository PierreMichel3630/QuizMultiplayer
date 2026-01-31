import { Box, ClickAwayListener, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { searchThemesAndCategoriesPaginate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { ICardImage } from "../card/CardImage";
import { ImageCard } from "../image/ImageCard";
import { BasicSearchInput } from "../Input";
import { SkeletonSearchs } from "../skeleton/SkeletonSearch";
import { Colors } from "src/style/Colors";

export const SearchBar = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const navigate = useNavigate();
  const ITEM_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const getSearch = useCallback(
    (page: number) => {
      setItemsSearch([]);
      setLoading(true);
      if (language) {
        searchThemesAndCategoriesPaginate(
          language,
          search,
          page,
          ITEM_PER_PAGE
        ).then(({ data }) => {
          const result = data ?? [];
          setItemsSearch([...result]);
          setLoading(false);
        });
      }
    },
    [search, language]
  );

  useEffect(() => {
    getSearch(0);
  }, [searchOpen, getSearch]);

  const handleSubmit = () => {
    setSearchOpen(false);
    navigate(`/search`, {
      state: {
        search: search,
      },
    });
  };

  return (
    <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
      <Box sx={{ maxWidth: px(640), flex: 1, position: "relative" }}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={setSearch}
          onFocus={() => setSearchOpen(true)}
          clear={() => setSearch("")}
          handleSubmit={handleSubmit}
          value={search}
        />
        {searchOpen && (
          <Paper
            sx={{
              position: "absolute",
              width: "calc(100% - 64px)",
              borderRadius: px(5),
              mt: px(5),
              p: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {loading ? (
              <SkeletonSearchs number={ITEM_PER_PAGE} />
            ) : (
              <>
                {itemsSearch.map((el, index) => (
                  <SearchResult
                    key={index}
                    value={el}
                    onSelect={() => setSearchOpen(false)}
                  />
                ))}
              </>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

interface SearchResultProps {
  value: ICardImage;
  onSelect: () => void;
}
const SearchResult = ({ value, onSelect }: SearchResultProps) => {
  const link = useMemo(
    () =>
      value.type === SearchType.THEME
        ? `/theme/${value.id}`
        : `/category/${value.id}`,
    [value.id, value.type]
  );

  return (
    <Link
      to={link}
      onClick={onSelect}
      style={{
        textDecoration: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: px(2),
          cursor: "pointer",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? Colors.grey
                : Colors.greyLightMode,
          },
        }}
      >
        <ImageCard value={value} size={40} />
        <Box>
          <Typography variant="h6">{value.name}</Typography>
          <TypeSearchTypography type={value.type} />
        </Box>
      </Box>
    </Link>
  );
};

interface TypeSearchTypographyProps {
  type?: SearchType;
}

const TypeSearchTypography = ({ type }: TypeSearchTypographyProps) => {
  const { t } = useTranslation();
  return (
    type && (
      <Typography variant="caption">{t(`enum.searchtype.${type}`)}</Typography>
    )
  );
};
