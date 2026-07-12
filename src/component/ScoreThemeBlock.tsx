import { Box, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { AvatarAccountBadge } from "./avatar/AvatarAccount";
import { CountryImageBlock } from "./CountryBlock";
import { InvertInfoBlock } from "./InfoBlock";

interface Props {
  score?: string | number;
  profile: Profile;
}

export const ScoreThemeBlock = ({ score, profile }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: percent(100),
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0,
        }}
      >
        <AvatarAccountBadge
          avatar={profile.avatar.icon}
          size={50}
          profile={profile}
          color={Colors.blue4}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden",
          }}
        >
          {profile.country && (
            <Box sx={{ flexShrink: 0 }}>
              <CountryImageBlock country={profile.country} size={25} />
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                width: "100%",
              }}
              noWrap
            >
              {profile.username}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <InvertInfoBlock title={t("commun.score")} value={score} />
      </Box>
    </Box>
  );
};
