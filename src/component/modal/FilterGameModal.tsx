import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Theme } from "src/models/Theme";
import { FilterGame } from "src/pages/HistoryGamePage";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { AutocompleteTheme } from "../Select";

interface Props {
  open: boolean;
  close: () => void;
  filter: FilterGame;
  onValid: (value: FilterGame) => void;
}

export const FilterGameModal = ({ open, close, filter, onValid }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [newFilter, setNewFilter] = useState(filter);

  useEffect(() => {
    setNewFilter(filter);
  }, [filter, open]);

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
            {t("commun.filtermygames")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ p: 1 }}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ToggleButtonGroup
              color="primary"
              value={newFilter.type}
              exclusive
              onChange={(
                _event: React.MouseEvent<HTMLElement>,
                newtype: "ALL" | "DUEL" | "SOLO"
              ) => {
                setNewFilter((prev) => ({ ...prev, type: newtype }));
              }}
            >
              <ToggleButton value="ALL">
                <Typography variant="h6">{t("commun.all")}</Typography>
              </ToggleButton>
              <ToggleButton value="SOLO">
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <PlayCircleIcon />
                  <Typography variant="h6">{t("commun.solo")}</Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="DUEL">
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <OfflineBoltIcon />
                  <Typography variant="h6">{t("commun.duel")}</Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <AutocompleteTheme
              value={newFilter.themes}
              onChange={(value: Array<Theme>) => {
                setNewFilter((prev) => ({ ...prev, themes: value }));
              }}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
          }}
        >
          <ButtonColor
            value={Colors.blue3}
            label={t("commun.filter")}
            icon={FilterAltIcon}
            onClick={() => onValid(newFilter)}
            variant="contained"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
