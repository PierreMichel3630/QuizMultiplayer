import {
  Autocomplete,
  Avatar,
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { padding, percent, px } from "csx";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { selectCategories } from "src/api/category";
import { selectThemesShop } from "src/api/theme";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { colorDifficulty, Difficulty } from "src/models/enum/DifficultyEnum";
import { Language, LANGUAGESQUESTION } from "src/models/Language";
import { ThemeShop } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";
import { AutocompleteInputTheme } from "./Autocomplete";
import { ICardImage } from "./card/CardImage";
import { ImageThemeBlock } from "./ImageThemeBlock";
import { BasicSearchInput } from "./Input";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

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
            <Typography variant="h6">{v.title}</Typography>
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

interface PropsSelectCategory {
  category: Category | null;
  onChange: (value: Category | null) => void;
}

export const SelectCategory = ({ category, onChange }: PropsSelectCategory) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const [categories, setCategories] = useState<Array<Category>>([]);

  const getCategories = useCallback(() => {
    selectCategories().then(({ data }) => {
      const value = data ?? [];
      setCategories(value);
    });
  }, []);
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <Autocomplete
      id="themeinput"
      value={category}
      onChange={(_event: SyntheticEvent, newValue: Category | null) => {
        onChange(newValue);
      }}
      options={[...categories].sort((a, b) => sortByName(language, a, b))}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Typography>{option.title}</Typography>
        </Box>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("commun.category")}
          placeholder={t("commun.selectcategory")}
        />
      )}
    />
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
    selectThemesShop().then(({ data }) => {
      setThemes(data ?? []);
    });
  }, []);

  return (
    <Autocomplete
      id="themeinput"
      value={theme}
      onChange={(_event: SyntheticEvent, newValue: ThemeShop | null) => {
        onChange(newValue);
      }}
      options={[...themes].sort((a, b) => sortByName(language, a, b))}
      getOptionLabel={(option) => option.name[language.iso]}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <JsonLanguageBlock value={option.name} />
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

interface PropsSelectIso {
  value: string;
  onChange: (value: string) => void;
}

export const SelectIso = ({ value, onChange }: PropsSelectIso) => {
  const { t } = useTranslation();
  const language = useMemo(
    () => LANGUAGESQUESTION.find((el) => el.iso === value),
    [value]
  );

  return (
    <Autocomplete
      disablePortal
      id="isoinput"
      value={language}
      onChange={(_event: SyntheticEvent, newValue: Language | null) => {
        if (newValue) onChange(newValue.iso);
      }}
      options={LANGUAGESQUESTION}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          {...props}
        >
          <Avatar src={option.icon} sx={{ width: 32, height: 32, mr: 1 }} />
          <Typography variant="h6">{option.name}</Typography>
        </Box>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("commun.language")}
          placeholder={t("commun.selectlanguage")}
        />
      )}
    />
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
