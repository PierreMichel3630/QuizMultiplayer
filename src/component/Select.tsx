import {
  Autocomplete,
  Avatar,
  Box,
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
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Difficulty, colorDifficulty } from "src/models/enum";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LockIcon from "@mui/icons-material/Lock";
import { uniqBy } from "lodash";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { LANGUAGESQUESTION, Language } from "src/models/Language";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";
import { AutocompleteInputTheme } from "./Autocomplete";
import { ImageThemeBlock } from "./ImageThemeBlock";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import ClearIcon from "@mui/icons-material/Clear";
import { BasicSearchInput } from "./Input";

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
          }}
        >
          {Object.keys(Difficulty).map((el) => (
            <Grid
              container
              sx={{
                cursor: "pointer",
                color: colorDifficulty[el],
                p: 1,
                "&:hover": {
                  color: "white",
                  backgroundColor: colorDifficulty[el],
                },
              }}
              alignItems="center"
              onClick={() => {
                onSelect(el as Difficulty);
                unFocus();
              }}
              key={el}
            >
              <Grid item xs={12}>
                <Typography variant="h4">
                  {t(`enum.difficulty.${el}`)}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Paper>
      )}
    </Box>
  );
};

interface PropsAutocompleteThemeAdmin {
  theme: Theme;
  onChange: (value: Theme) => void;
}

export const AutocompleteThemeAdmin = ({
  theme,
  onChange,
}: PropsAutocompleteThemeAdmin) => {
  const { t } = useTranslation();
  const { themesAdmin } = useApp();
  const { language } = useUser();

  const themesDisplay = useMemo(
    () =>
      uniqBy(themesAdmin, (el) => el.id).sort((a, b) =>
        sortByName(language, a, b)
      ),
    [themesAdmin, language]
  );

  return (
    <Autocomplete
      disablePortal
      id="themeinput"
      value={theme}
      onChange={(_event: SyntheticEvent, newValue: Theme | null) => {
        if (newValue) onChange(newValue);
      }}
      options={themesDisplay}
      getOptionLabel={(option) => option.name[language.iso]}
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
          <ImageThemeBlock theme={option} size={50} />
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
    />
  );
};

interface PropsAutocompleteTheme {
  value: Array<Theme>;
  onChange: (value: Array<Theme>) => void;
  isAdmin?: boolean;
}

export const AutocompleteTheme = ({
  value,
  onChange,
  isAdmin = false,
}: PropsAutocompleteTheme) => {
  const { t } = useTranslation();

  const deleteTheme = (id: number) => {
    let newValue: Array<Theme> = [...value];
    newValue = newValue.filter((el) => el.id !== id);
    onChange(newValue);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <AutocompleteInputTheme
          placeholder={t("commun.selecttheme")}
          onSelect={(newvalue) => onChange([...value, newvalue])}
          isAdmin={isAdmin}
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
            <JsonLanguageBlock variant="h6" value={v.name} />
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

interface PropsSelectTheme {
  onChange: (value: Theme) => void;
}

export const SelectTheme = ({ onChange }: PropsSelectTheme) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <AutocompleteInputTheme
          placeholder={t("commun.selecttheme")}
          onSelect={(newvalue) => onChange(newvalue)}
        />
      </Grid>
    </Grid>
  );
};

interface PropsSelectCategory {
  category: Category | null;
  onChange: (value: Category) => void;
}

export const SelectCategory = ({ category, onChange }: PropsSelectCategory) => {
  const { t } = useTranslation();
  const { categoriesAdmin } = useApp();
  const { language } = useUser();

  return (
    <Autocomplete
      disablePortal
      id="themeinput"
      value={category}
      onChange={(_event: SyntheticEvent, newValue: Category | null) => {
        if (newValue) onChange(newValue);
      }}
      options={categoriesAdmin.sort((a, b) => sortByName(language, a, b))}
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
          label={t("commun.category")}
          placeholder={t("commun.selectcategory")}
        />
      )}
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

interface PropsSelectTitle {
  onChange: (value: number) => void;
}

export const SelectTitle = ({ onChange }: PropsSelectTitle) => {
  const { t } = useTranslation();
  const { titles, mytitles } = useApp();
  const { profile } = useAuth();
  const { language } = useUser();

  const titlesUnlock = useMemo(() => mytitles.map((el) => el.id), [mytitles]);

  const options = useMemo(() => {
    return titles
      .sort((a, b) => {
        const isALock = titlesUnlock.includes(a.id);
        const isBLock = titlesUnlock.includes(b.id);
        return Number(isBLock) - Number(isALock) || sortByName(language, a, b);
      })
      .map((el) => ({ value: el.id.toString(), label: el.name }));
  }, [titles, titlesUnlock, language]);

  return (
    <FormControl fullWidth>
      <InputLabel id="label-title-select">{t("commun.selecttitle")}</InputLabel>
      <Select
        labelId="label-title-select"
        id="title-select"
        value={
          profile && profile.title ? profile.title.id.toString() : undefined
        }
        label={t("commun.selecttitle")}
        onChange={(event: SelectChangeEvent) =>
          onChange(Number(event.target.value))
        }
      >
        {options.map((option) => {
          const isLock = !titlesUnlock.includes(Number(option.value));
          return (
            <MenuItem key={option.value} value={option.value} disabled={isLock}>
              {isLock && <LockIcon sx={{ color: Colors.lightgrey2 }} />}
              <JsonLanguageBlock variant="body1" value={option.label} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

interface PropsSelectIdTheme {
  theme: string;
  onChange: (value: string) => void;
}

export const SelectIdTheme = ({ theme, onChange }: PropsSelectIdTheme) => {
  const { t } = useTranslation();
  const { themes } = useApp();
  const { language } = useUser();

  const options = useMemo(() => {
    return uniqBy(themes, (el) => el.id)
      .sort((a, b) => sortByName(language, a, b))
      .map((el) => ({ value: el.id.toString(), label: el.name, theme: el }));
  }, [themes, language]);

  return (
    <FormControl fullWidth>
      <InputLabel id="label-theme-select">{t("commun.selecttheme")}</InputLabel>
      <Select
        labelId="label-theme-select"
        id="theme-select"
        value={theme}
        label={t("commun.selecttitle")}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        renderValue={(option) => {
          const theme = themes.find((el) => el.id === Number(option));
          return (
            theme && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <ImageThemeBlock theme={theme} size={50} />
                <JsonLanguageBlock variant="h6" value={theme.name} />
              </Box>
            )
          );
        }}
      >
        {options.map((option) => {
          return (
            <MenuItem
              value={option.value}
              key={option.value}
              sx={{ display: "flex", gap: 1 }}
            >
              <ImageThemeBlock theme={option.theme} size={50} />
              <JsonLanguageBlock variant="h6" value={option.label} />
            </MenuItem>
          );
        })}
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
