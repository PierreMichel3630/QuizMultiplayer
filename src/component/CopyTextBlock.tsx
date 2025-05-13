import { Box, Button, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  text: string;
}

export const CopyTextBlock = ({ text }: Props) => {
  const { t } = useTranslation();

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
  };

  return (
    <Box>
      <Grid container alignItems="center">
        <Grid item xs={9}>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: percent(100),
            }}
          >
            <Typography variant="body1" noWrap>
              {text}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Button
            sx={{
              backgroundColor: Colors.colorApp,
              p: "2px 10px",
              borderRadius: px(50),
            }}
            onClick={copyText}
          >
            <Typography variant="h6" noWrap>
              {t("commun.copy")}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
