import ClearIcon from "@mui/icons-material/Clear";
import { Grid, IconButton, InputBase, Paper } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "./ImageThemeBlock";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { uniqBy } from "lodash";
import { sortByName } from "src/utils/sort";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { searchString } from "src/utils/string";

interface PropsAutocompleteInput {
  placeholder: string;
  onSelect: (value: Theme) => void;
  isAdmin?: boolean;
}

export const AutocompleteInputTheme = ({
  placeholder,
  onSelect,
  isAdmin = false,
}: PropsAutocompleteInput) => {
  const { themes, themesAdmin } = useApp();
  const { language } = useUser();

  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [maxIndex, setMaxIndex] = useState(10);
  const onFocus = () => setFocused(true);
  const unFocus = () => setFocused(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const refOptions = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        unFocus();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const uniqThemes = useMemo(
    () =>
      uniqBy(isAdmin ? themesAdmin : themes, (el) => el.id).sort((a, b) =>
        sortByName(language, a, b)
      ),
    [isAdmin, themesAdmin, themes, language]
  );

  const themesSearch = useMemo(() => {
    const searchTheme = uniqThemes.filter((el) =>
      searchString(search, el.name[language.iso])
    );
    return [...searchTheme];
  }, [uniqThemes, search, language.iso]);

  const themesOption = useMemo(
    () => [...themesSearch].splice(0, maxIndex),
    [themesSearch, maxIndex]
  );

  useEffect(() => {
    const refCurrent = refOptions.current;
    const handleScroll = () => {
      if (
        refCurrent &&
        (refCurrent.scrollTop + 500 <= refCurrent.scrollHeight ||
          maxIndex >= themesSearch.length)
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 10);
    };
    if (refOptions && refCurrent) {
      refCurrent.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (refOptions && refCurrent) {
        refCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [themesSearch, maxIndex]);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Paper
        variant="outlined"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: percent(100),
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ "aria-label": placeholder }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={onFocus}
        />
        {search !== "" && (
          <IconButton
            type="button"
            size="small"
            aria-label="clear"
            onClick={() => setSearch("")}
          >
            <ClearIcon sx={{ width: 15, height: 15 }} />
          </IconButton>
        )}
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          display: focused ? "flex" : "none",
          alignItems: "center",
          width: percent(100),
          zIndex: 2,
          flexDirection: "column",
          position: "absolute",
          maxHeight: px(200),
          overflow: "scroll",
        }}
        ref={refOptions}
      >
        {themesOption.map((el) => (
          <Grid
            container
            sx={{
              cursor: "pointer",
              p: 1,
              "&:hover": {
                color: Colors.greyDarkMode,
                backgroundColor: Colors.lightgrey,
              },
            }}
            alignItems="center"
            onClick={() => {
              setSearch("");
              setMaxIndex(10);
              onSelect(el);
              unFocus();
            }}
            key={el.id}
            spacing={1}
          >
            <Grid item>
              <ImageThemeBlock theme={el} size={50} />
            </Grid>
            <Grid item xs={9}>
              <JsonLanguageBlock value={el.name} />
            </Grid>
          </Grid>
        ))}
      </Paper>
    </div>
  );
};
