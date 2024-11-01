import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { px } from "csx";
import { Profile } from "src/models/Profile";

import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { useMemo } from "react";

interface Props {
  profile: Profile | null;
  onChange: () => void;
  onDelete: () => void;
}

export const MyCountryBlock = ({ profile, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const { countries } = useApp();

  const myCountry = useMemo(
    () =>
      profile && profile.country !== null
        ? countries.find((el) => el.id === profile.country)
        : undefined,
    [countries, profile]
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
          onClick={onChange}
        >
          <Avatar
            src={myCountry.flag}
            sx={{
              width: 40,
              height: 40,
              border: `2px solid ${Colors.white}`,
            }}
          />
          <JsonLanguageBlock variant="h6" value={myCountry.name} />
          <DeleteIcon sx={{ cursor: "pointer" }} onClick={onDelete} />
        </Paper>
      ) : (
        <Button
          variant="contained"
          fullWidth
          onClick={onChange}
          sx={{ backgroundColor: Colors.grey2 }}
        >
          <Typography variant="h6">{t("commun.selectcountry")}</Typography>
        </Button>
      )}
    </Box>
  );
};
