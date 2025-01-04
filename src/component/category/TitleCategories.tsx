import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { JsonLanguage } from "src/models/Language";
import { TitleCount } from "../title/TitleCount";

interface Props {
  title: string | JsonLanguage;
  count: number;
  link?: string;
}

export const TitleCategories = ({ title, count, link }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ maxWidth: "calc(100vw - 130px)" }}>
        <TitleCount title={title} count={count} />
      </Box>
      {link && (
        <Button
          variant="outlined"
          sx={{
            textTransform: "uppercase",
            "&:hover": {
              border: "2px solid currentColor",
            },
          }}
          color="secondary"
          size="small"
          href={link}
        >
          <Typography variant="h6">{t("commun.seeall")}</Typography>
        </Button>
      )}
    </Box>
  );
};
