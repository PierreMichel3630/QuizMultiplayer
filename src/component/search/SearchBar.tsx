import {
  Alert,
  Box,
  ClickAwayListener,
  Divider,
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
import { ImageTypeCard } from "../image/ImageCard";
import { BasicSearchInput } from "../Input";
import { SkeletonSearchs } from "../skeleton/SkeletonSearch";

import { getLink } from "src/utils/link";
import { useGameModes } from "src/hook/useGameModes";
import { searchString } from "src/utils/string";

export const SearchBar = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { themes, modes } = useGameModes();
  const navigate = useNavigate();
  const ITEM_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  const getSearch = useCallback(
    (page: number, searchValue: string) => {
      setItemsSearch([]);
      if (language && searchValue !== "") {
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
      } else {
        setLoading(false);
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

  const onChangeSearch = (value: string) => {
    if (value === "") {
      setItemsSearch([]);
    }
    setSearch(value);
  };

  const modesDisplay = useMemo(() => {
    const modesFilter = [...modes].filter((el) =>
      searchString(search, el.name),
    );
    const themesFilter = [...themes].filter((el) =>
      searchString(search, el.name),
    );
    return [...modesFilter, ...themesFilter];
  }, [modes, themes, search]);

  return (
    <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
      <Box sx={{ maxWidth: px(640), flex: 1, position: "relative" }}>
        <BasicSearchInput
          label={t("commun.search")}
          onChange={onChangeSearch}
          onFocus={() => setSearchOpen(true)}
          clear={() => onChangeSearch("")}
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
                {itemsSearch.length > 0 || modesDisplay.length > 0 ? (
                  <>
                    {modesDisplay.map((el, index) => (
                      <SearchResult
                        key={index}
                        value={el}
                        onSelect={() => setSearchOpen(false)}
                      />
                    ))}
                    {modesDisplay.length > 0 && itemsSearch.length > 0 && (
                      <Divider />
                    )}
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
    return getLink(value.type, value.id);
  }, [value.id, value.type]);

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
        <ImageTypeCard type={value.type} value={value} size={40} />
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
