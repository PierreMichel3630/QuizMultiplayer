import { Box, Button, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useApp } from "src/context/AppProvider";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { SelectCountryModal } from "./modal/SelectCountryModal";

interface Props {
  country: number | null;
  onChange: (value: number) => void;
  onDelete: () => void;
}

export const MyCountryBlock = ({ country, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const { countries } = useApp();
  const [open, setOpen] = useState(false);

  const myCountry = useMemo(
    () =>
      country !== null ? countries.find((el) => el.id === country) : undefined,
    [countries, country]
  );

  return (
    <Box>
      {myCountry ? (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: px(5),
            cursor: "pointer",
            justifyContent: "space-between",
            backgroundColor: Colors.grey,
          }}
          onClick={() => setOpen(true)}
        >
          <img
            src={myCountry.flag}
            style={{
              maxHeight: 30,
              border: `1px solid ${Colors.grey}`,
            }}
          />
          <JsonLanguageBlock variant="h4" value={myCountry.name} />
          <DeleteIcon sx={{ cursor: "pointer" }} onClick={onDelete} />
        </Paper>
      ) : (
        <Button
          variant="contained"
          fullWidth
          onClick={() => setOpen(true)}
          sx={{ backgroundColor: Colors.grey2 }}
        >
          <Typography variant="h6">{t("commun.selectcountry")}</Typography>
        </Button>
      )}
      {open && (
        <SelectCountryModal
          open={open}
          close={() => setOpen(false)}
          onValid={(value) => {
            onChange(value);
            setOpen(false);
          }}
        />
      )}
    </Box>
  );
};
