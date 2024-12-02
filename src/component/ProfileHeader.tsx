import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountryBlock } from "src/component/CountryBlock";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";

import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { StatAccomplishment } from "src/models/Accomplishment";
import { getLevel } from "src/utils/calcul";
import { JsonLanguage } from "src/models/Language";

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
  const { t } = useTranslation();

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
    const urlprofile =
      profile && profile.banner
        ? `url("/banner/${profile.banner.icon}")`
        : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.blue3} 46%, ${Colors.blue} 100%)`;
    return banner ? `url("/banner/${banner}")` : urlprofile;
  }, [banner, profile]);

  return (
    <Box
      sx={{
        p: 1,
        backgroundColor: Colors.blue3,
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
          <Typography variant="h2" color="text.secondary">
            {profile.username}
          </Typography>
          {(title || profile.title) && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              value={title ? title : profile.title!.name}
            />
          )}
        </Grid>
        {stat && (
          <Grid item>
            <Typography variant="h4" component="span" color="text.secondary">
              {stat.xp}
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="text.secondary"
            >
              {t("commun.xpabbreviation")}
            </Typography>
          </Grid>
        )}
        {profile.country && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <CountryBlock country={profile.country} color="text.secondary" />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
