import { Box, Button, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Country } from "src/models/Country";
import { Colors } from "src/style/Colors";
import { SelectCountryModal } from "./modal/SelectCountryModal";

interface PropsRegisterCountryBlock {
  country: Country | null;
  onChange: (value: Country) => void;
  onDelete: () => void;
}

export const RegisterCountryBlock = ({
  country,
  onChange,
  onDelete,
}: PropsRegisterCountryBlock) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      {country ? (
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
            src={country.flag}
            style={{
              maxHeight: 30,
              border: `1px solid ${Colors.grey}`,
            }}
          />
          <JsonLanguageBlock variant="h4" value={country.name} />
          <DeleteIcon
            sx={{ cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          />
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

interface Props {
  country: Country | null;
  onChange: (value: Country) => void;
  onDelete: () => void;
}

export const MyCountryBlock = ({ country, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      {country ? (
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
            src={country.flag}
            style={{
              maxHeight: 30,
              border: `1px solid ${Colors.grey}`,
            }}
          />
          <JsonLanguageBlock variant="h4" value={country.name} />
          <DeleteIcon
            sx={{ cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          />
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
