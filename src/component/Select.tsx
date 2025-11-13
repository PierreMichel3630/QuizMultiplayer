import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { padding, percent, px } from "csx";
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { getCategoryById, searchCategoriesPaginate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { colorDifficulty, Difficulty } from "src/models/enum/DifficultyEnum";
import { Language } from "src/models/Language";
import { ThemeShop } from "src/models/Shop";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";
import { AutocompleteInputTheme } from "./Autocomplete";
import { ICardImage } from "./card/CardImage";
import { ImageThemeBlock } from "./ImageThemeBlock";
import { BasicSearchInput } from "./Input";
import { LanguageIcon } from "./language/LanguageBlock";
import { TextNameBlock } from "./language/TextLanguageBlock";
import { selectThemeShop } from "src/api/shop";

interface Props {
  value: Difficulty;
  onSelect: (value: Difficulty) => void;
}

export const SelectDifficulty = ({ value, onSelect }: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);

  const onFocus = () => setFocused((prev) => !prev);
  const unFocus = () => setFocused(false);
  const ref = useRef<HTMLDivElement | null>(null);
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

  return (
    <Box style={{ position: "relative" }} ref={ref}>
      <Box
        sx={{
          p: "2px 10px",
          display: "flex",
          alignItems: "center",
          width: percent(100),
          cursor: "pointer",
          justifyContent: "space-between",
          gap: 1,
          backgroundColor: colorDifficulty[value],
          borderRadius: 2,
        }}
        onClick={onFocus}
      >
        <Box>
          <Typography variant="h4" sx={{ color: "white" }}>
            {t(`enum.difficulty.${value}`)}
          </Typography>
        </Box>
        <ArrowDropDownIcon sx={{ color: "white" }} />
      </Box>
      {focused && (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            width: percent(100),
            zIndex: 2,
            flexDirection: "column",
            position: "absolute",
            maxHeight: px(200),
            mt: 1,
            overflow: "scroll",
            overflowY: "inherit",
            gap: 1,
            p: padding(5, 10),
          }}
        >
          {Object.keys(Difficulty).map((el) => (
            <>
              <Box
                onClick={() => {
                  onSelect(el as Difficulty);
                  unFocus();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: percent(100),
                }}
              >
                <Box
                  sx={{
                    width: px(30),
                    height: px(30),
                    backgroundColor: colorDifficulty[el],
                    borderRadius: px(10),
                    border: `2px solid ${Colors.white}`,
                  }}
                />
                <Typography variant="h4">
                  {t(`enum.difficulty.${el}`)}
                </Typography>
              </Box>
              <Divider sx={{ width: percent(100) }} />
            </>
          ))}
        </Paper>
      )}
    </Box>
  );
};

interface PropsAutocompleteTheme {
  value: Array<ICardImage>;
  onChange: (value: Array<ICardImage>) => void;
}

export const AutocompleteTheme = ({
  value,
  onChange,
}: PropsAutocompleteTheme) => {
  const { t } = useTranslation();

  const deleteTheme = (id: number) => {
    let newValue: Array<ICardImage> = [...value];
    newValue = newValue.filter((el) => el.id !== id);
    onChange(newValue);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <AutocompleteInputTheme
          placeholder={t("commun.selecttheme")}
          onSelect={(newvalue) => onChange([...value, newvalue])}
        />
      </Grid>

      {value.map((v) => (
        <Grid item key={v.id}>
          <Paper
            variant="outlined"
            sx={{
              p: padding(2, 10),
              display: "flex",
              gap: 1,
              alignItems: "center",
              borderRadius: px(50),
            }}
          >
            <ImageThemeBlock theme={v} size={30} />
            <Typography variant="h6">{v.name}</Typography>
            <ClearIcon
              sx={{ width: 15, height: 15, cursor: "pointer" }}
              onClick={() => deleteTheme(v.id)}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsSelectThemeShop {
  theme: ThemeShop | null;
  onChange: (value: ThemeShop | null) => void;
}

export const SelectThemeShop = ({ theme, onChange }: PropsSelectThemeShop) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [themes, setThemes] = useState<Array<ThemeShop>>([]);

  useEffect(() => {
    selectThemeShop().then(({ data }) => {
      setThemes(data ?? []);
    });
  }, []);

  const options = useMemo(
    () =>
      language ? [...themes].sort((a, b) => sortByName(language, a, b)) : [],
    [language, themes]
  );

  return (
    <Autocomplete
      id="themeinput"
      value={theme}
      onChange={(_event: SyntheticEvent, newValue: ThemeShop | null) => {
        onChange(newValue);
      }}
      options={options}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <TextNameBlock values={option.themeshoptranslation} />
        </Box>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("commun.theme")}
          placeholder={t("commun.selecttheme")}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};

interface PropsSelectLanguage {
  value: Language;
  onChange: (value: Language) => void;
  languages: Array<Language>;
}

export const SelectLanguage = ({
  languages,
  value,
  onChange,
}: PropsSelectLanguage) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LanguageIcon language={value} size={40} onClick={handleClick} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {languages.map((el, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              onChange(el);
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LanguageIcon language={el} />
              <Typography variant="h6">{el.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

interface ValueSelect {
  label: string;
  value: string;
}
interface PropsBasicSelect {
  label: string;
  placeholder: string;
  options: Array<ValueSelect>;
  value: string;
  onChange: (value: string) => void;
}

export const BasicSelect = ({
  label,
  options,
  placeholder,
  value,
  onChange,
}: PropsBasicSelect) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="label-basic-select">{label}</InputLabel>
      <Select
        labelId="label-basic-select"
        id="basic-select"
        value={value}
        label={label}
        placeholder={placeholder}
        onChange={(event: SelectChangeEvent) =>
          onChange(event.target.value as string)
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface PropsAutocompleteNumber {
  label: string;
  value: Array<number>;
  onChange: (value: Array<number>) => void;
}

export const AutocompleteNumber = ({
  label,
  value,
  onChange,
}: PropsAutocompleteNumber) => {
  const [search, setSearch] = useState("");

  const deleteValue = (id: number) => {
    let newValue: Array<number> = [...value];
    newValue = newValue.filter((el) => el !== id);
    onChange(newValue);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onChange([...value, Number(search)]);
            setSearch("");
          }}
        >
          <BasicSearchInput
            label={label}
            onChange={(value) => setSearch(value)}
            value={search}
            clear={() => setSearch("")}
          />
        </form>
      </Grid>

      {value.map((v, index) => (
        <Grid item key={index}>
          <Paper
            variant="outlined"
            sx={{
              p: padding(2, 10),
              display: "flex",
              gap: 1,
              alignItems: "center",
              borderRadius: px(50),
            }}
          >
            <Typography variant="h6">{v}</Typography>
            <ClearIcon
              sx={{ width: 15, height: 15, cursor: "pointer" }}
              onClick={() => deleteValue(v)}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsSelectCategory {
  value: number | null;
  onChange: (value: { id: number; name: string } | null) => void;
}

export const SelectCategory = ({ value, onChange }: PropsSelectCategory) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const listboxRef = useRef(null);

  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [category, setCategory] = useState<{ id: number; name: string } | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (language) {
      searchCategoriesPaginate(language, search, 0).then(({ data }) => {
        setCategories(data ?? []);
        setPage((prev) => prev + 1);
      });
    }
  }, [language, search]);

  useEffect(() => {
    if (language && value) {
      getCategoryById(value, language).then(({ data }) => {
        setCategory(data);
      });
    }
  }, [value, language]);

  const handleScroll = (event: any) => {
    if (loading || !hasMore) return;
    const listboxNode = event.currentTarget;
    const bottom =
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 5;
    if (bottom && language) {
      setLoading(true);
      searchCategoriesPaginate(language, search, page).then(({ data }) => {
        const res = data ?? [];
        setHasMore(res.length > 0);
        setCategories((prev) => [...prev, ...res]);
        setPage((prev) => prev + 1);
        setLoading(false);
      });
    }
  };

  return (
    <Autocomplete
      id="categoryinput"
      value={category}
      onChange={(_event: SyntheticEvent, newValue: any) => {
        onChange(newValue.id);
      }}
      options={categories}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Typography>{option.name}</Typography>
        </Box>
      )}
      ListboxProps={{
        onScroll: handleScroll,
        ref: listboxRef,
      }}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t("commun.category")}
          placeholder={t("commun.selectcategory")}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
    />
  );
};
