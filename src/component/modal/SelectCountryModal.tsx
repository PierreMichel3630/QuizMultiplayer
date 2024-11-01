import {
  AppBar,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { px } from "csx";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicSearchInput } from "../Input";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Country } from "src/models/Country";
import { Profile } from "src/models/Profile";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";

interface Props {
  open: boolean;
  close: () => void;
  onValid: (id: number) => void;
  profile?: Profile;
}

export const SelectCountryModal = ({
  open,
  close,
  onValid,
  profile,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { language } = useUser();
  const { countries } = useApp();

  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("");
  const [countriesFilter, setCountriesFilter] = useState<Array<Country>>([]);
  const [maxIndex, setMaxIndex] = useState(25);

  useEffect(() => {
    const getResult = () => {
      if (value !== "") {
        const countriesFilter = countries
          .sort((a, b) => sortByName(language, a, b))
          .filter((el) => searchString(value, el.name[language.iso]));

        setCountriesFilter(countriesFilter);
      } else {
        setCountriesFilter(
          countries.sort((a, b) => sortByName(language, a, b))
        );
      }
    };
    getResult();
  }, [value, language, countries]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        ref.current &&
        (window.innerHeight + ref.current.scrollTop + 1600 <=
          ref.current.offsetHeight ||
          maxIndex >= countriesFilter.length)
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 25);
    };
    if (ref && ref.current) {
      ref.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      ref.current?.removeEventListener("scroll", handleScroll);
    };
  }, [countriesFilter, maxIndex, ref.current]);

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.myorigincountry")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 0, m: 0 }} ref={ref}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 3,
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ p: 1 }}>
              <BasicSearchInput
                label={t("commun.search")}
                value={value}
                onChange={setValue}
                clear={() => setValue("")}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <List sx={{ border: "none" }}>
              <Divider />
              {[...countriesFilter].splice(0, maxIndex).map((el) => (
                <Fragment key={el.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => onValid(el.id)}>
                      <ListItemIcon>
                        {profile && profile.country === el.id && (
                          <CheckCircleIcon color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemIcon>
                        <Avatar
                          alt="flag"
                          src={el.flag}
                          sx={{ width: px(30), height: px(30) }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={<JsonLanguageBlock value={el.name} />}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
