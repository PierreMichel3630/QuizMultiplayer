import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import head from "src/assets/headLong.png";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ModesBlock } from "../ModeBlock";
import { RuleBlock } from "../RuleBlock";

import { important, px } from "csx";

interface Props {
  open: boolean;
  close: () => void;
}

export const TutorialModal = ({ open, close }: Props) => {
  const MAXPAGE = 2;
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="sm"
      fullScreen
      sx={{ backgroundColor: "inherit" }}
    >
      <IconButton
        color="inherit"
        onClick={close}
        size="small"
        aria-label="close"
        sx={{ position: "absolute", top: 0, right: 0 }}
      >
        <CloseIcon sx={{ color: Colors.white }} fontSize="large" />
      </IconButton>
      <DialogContent
        sx={{
          p: 1,
          backgroundImage: `url(${head})`,
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{ mb: 1, flex: 1 }}
          alignContent="center"
        >
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: ["Kalam", "cursive"].join(","),
                fontSize: important(px(40)),
                textShadow: "2px 2px 4px black",
              }}
              variant="h1"
              color="text.secondary"
            >
              {t("tutorial.title")}
            </Typography>
          </Grid>
          {page === 1 ? (
            <>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  color="text.secondary"
                  sx={{
                    textShadow: "2px 2px 4px black",
                  }}
                >
                  {t("commun.howtoplay")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RuleBlock />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  color="text.secondary"
                  sx={{
                    textShadow: "2px 2px 4px black",
                  }}
                >
                  {t("commun.modes")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ModesBlock summary />
              </Grid>
            </>
          )}
        </Grid>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 3,
            pb: 1,
          }}
        >
          {page >= MAXPAGE ? (
            <ButtonColor
              size="small"
              value={Colors.black}
              label={t("commun.start")}
              onClick={close}
              variant="contained"
            />
          ) : (
            <ButtonColor
              size="small"
              value={Colors.black}
              label={t("commun.next")}
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => setPage((prev) => prev + 1)}
              variant="contained"
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
