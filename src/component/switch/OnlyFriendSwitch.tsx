import { Switch, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { percent } from "csx";
import { t } from "i18next";

interface Props {
  isOnlyFriend: boolean;
  onChange: (value: boolean) => void;
}

export const OnlyFriendSwitch = ({ isOnlyFriend, onChange }: Props) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 1,
      width: percent(100),
    }}
  >
    <Switch
      color="secondary"
      checked={isOnlyFriend}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
      }}
    />
    <Typography variant="body1">{t("commun.onlyfriend")}</Typography>
  </Box>
);
