import {
  Alert,
  Box,
  ClickAwayListener,
  Paper,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { searchThemesAndCategoriesPaginate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { Colors } from "src/style/Colors";
import { ICardImage } from "../card/CardImage";
import { ImageCard } from "../image/ImageCard";
import { BasicSearchInput } from "../Input";
import { SkeletonSearchs } from "../skeleton/SkeletonSearch";

import ListMode from "src/assets/mode/list.png";

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
    (page: number, searchValue: string) => {
      setItemsSearch([]);
      if (language) {
        searchThemesAndCategoriesPaginate(
          language,
          searchValue,
          page,
          ITEM_PER_PAGE,
        ).then(({ data }) => {
          const result = data ?? [];
          setItemsSearch([...result]);
          setLoading(false);
        });
      }
    },
    [language],
  );

  const debouncedFetch = useMemo(
    () => debounce((val: string) => getSearch(0, val), 500),
    [getSearch],
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    if (searchOpen) {
      setLoading(true);
      debouncedFetch(search);
    }
  }, [search, searchOpen, debouncedFetch]);

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
                {itemsSearch.length > 0 ? (
                  <>
                    {itemsSearch.map((el, index) => (
                      <SearchResult
                        key={index}
                        value={el}
                        onSelect={() => setSearchOpen(false)}
                      />
                    ))}
                  </>
                ) : (
                  <Alert severity="warning">{t("commun.noresult")}</Alert>
                )}
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
  const link = useMemo(() => {
    let result = "/";
    if (value.type) {
      switch (value.type) {
        case SearchType.THEME:
          result = `/theme/${value.id}`;
          break;
        case SearchType.CATEGORY:
          result = `/category/${value.id}`;
          break;
        case SearchType.LIST:
          result = `/list/${value.id}`;
          break;
      }
    }
    return result;
  }, [value.id, value.type]);

  const valueImageCard = useMemo(() => {
    let result = { image: value.image, color: value.color };
    switch (value.type) {
      case SearchType.LIST:
        result = { image: ListMode, color: Colors.colorList };
        break;
      case SearchType.GAME:
        result = { image: value.image, color: Colors.colorBrainTest };
        break;
      case SearchType.CATEGORY:
      case SearchType.GAMEMODE:
      case SearchType.THEME:
        result = { image: value.image, color: value.color };
        break;
    }
    return result;
  }, [value]);

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
        <ImageCard value={valueImageCard} size={40} />
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
