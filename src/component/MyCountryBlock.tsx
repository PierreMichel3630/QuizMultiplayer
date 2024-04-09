import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { px } from "csx";
import { Profile } from "src/models/Profile";

import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  profile: Profile | null;
  onChange: () => void;
  onDelete: () => void;
}

export const MyCountryBlock = ({ profile, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const { countries } = useApp();

  const myCountry =
    profile && profile.country !== null
      ? countries.find((el) => el.id === profile.country)
      : undefined;
  return (
    <Box>
      {myCountry ? (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1,
            cursor: "pointer",
            justifyContent: "space-between",
            backgroundColor: Colors.lightgrey,
          }}
          onClick={onChange}
        >
          <Avatar
            alt="flag"
            src={myCountry.flag}
            sx={{ width: px(35), height: px(35) }}
          />
          <JsonLanguageBlock variant="h4" value={myCountry.name} />
          <DeleteIcon sx={{ cursor: "pointer" }} onClick={onDelete} />
        </Paper>
      ) : (
        <Button variant="contained" fullWidth onClick={onChange}>
          <Typography variant="h6">{t("commun.selectcountry")}</Typography>
        </Button>
      )}
    </Box>
  );
};
