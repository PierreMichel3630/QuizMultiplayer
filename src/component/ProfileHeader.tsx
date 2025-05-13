import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { CountryBlock } from "src/component/CountryBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";

import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { StatAccomplishment } from "src/models/Accomplishment";
import { JsonLanguage } from "src/models/Language";
import { getLevel } from "src/utils/calcul";

interface Props {
  profile: Profile;
  avatar?: string;
  banner?: string;
  badge?: string;
  title?: JsonLanguage;
}

export const ProfilHeader = ({
  profile,
  avatar,
  badge,
  banner,
  title,
}: Props) => {
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getStats = () => {
      selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
        setStat(data as StatAccomplishment);
      });
    };
    getStats();
  }, [profile]);

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

  const bannerImage = useMemo(() => {
    const urlprofile = profile?.banner
      ? `url("${profile.banner.src}")`
      : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.colorApp} 46%, ${Colors.blue} 100%)`;
    return banner ? `url("${banner}")` : urlprofile;
  }, [banner, profile]);

  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: Colors.colorApp,
        backgroundImage: bannerImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item sx={{ mb: 1 }}>
          <AvatarAccountBadge
            profile={profile}
            avatar={avatar}
            badge={badge}
            size={120}
            color={Colors.white}
            backgroundColor={Colors.grey2}
            level={level}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            color="text.secondary"
            sx={{
              textShadow: "1px 1px 2px black",
            }}
          >
            {profile.username}
          </Typography>
          {(title || profile.title) && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              value={title ?? profile.title!.name}
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            />
          )}
        </Grid>
        {profile.country && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <CountryBlock country={profile.country} color="text.secondary" />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
