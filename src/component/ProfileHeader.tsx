import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { CountryBlock } from "src/component/CountryBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Title } from "src/models/Title";
import { getLevel } from "src/utils/calcul";
import { TextNameBlock } from "./language/TextLanguageBlock";
import { ProfileTitleBlock } from "./title/ProfileTitle";

interface Props {
  profile: Profile;
  avatar?: string;
  banner?: string;
  badge?: string;
  title?: Title;
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
        <Grid sx={{ mb: 1 }}>
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
          sx={{
            textAlign: "center",
          }}
          size={12}>
          <Typography
            variant="h2"
            color="text.secondary"
            sx={{
              textShadow: "1px 1px 2px black",
            }}
          >
            {profile.username}
          </Typography>
          {title ? (
            <TextNameBlock variant="h4" values={title.titletranslation} />
          ) : (
            <ProfileTitleBlock titleprofile={profile.titleprofile} />
          )}
        </Grid>
        {profile.country && (
          <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
            <CountryBlock country={profile.country} color="text.secondary" />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
