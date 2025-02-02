import { Box, Grid, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { ExtraDuelGameXP } from "src/models/DuelGame";
import { ExtraSoloGameXP } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { getExperienceByLevel, getLevel } from "src/utils/calcul";
import { AvatarAccountBadge } from "./avatar/AvatarAccount";
import { useUser } from "src/context/UserProvider";

interface Props {
  xp?: ExtraDuelGameXP;
}

export const ExperienceBlock = ({ xp }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [profile]);

  const xpTotal = useMemo(() => {
    return xp ? xp.match + xp.matchscore + xp.victorybonus : 0;
  }, [xp]);

  const myLevel = useMemo(() => {
    return stat !== undefined ? getLevel(stat.xp) : undefined;
  }, [stat]);

  const xpLevel = useMemo(() => {
    const lvlCurrent =
      myLevel !== undefined ? getExperienceByLevel(myLevel) : 0;
    const lvlNext =
      myLevel !== undefined ? getExperienceByLevel(myLevel + 1) : 0;
    return myLevel !== undefined ? lvlNext - lvlCurrent : undefined;
  }, [myLevel]);

  const myXpLevel = useMemo(() => {
    const lvlCurrent =
      myLevel !== undefined ? getExperienceByLevel(myLevel) : 0;
    return myLevel !== undefined && stat !== undefined
      ? stat.xp - lvlCurrent
      : undefined;
  }, [myLevel, stat]);

  const pourcentage = useMemo(() => {
    return xpLevel !== undefined && myXpLevel !== undefined
      ? ((myXpLevel - xpTotal) / xpLevel) * 100
      : 0;
  }, [xpLevel, myXpLevel, xpTotal]);

  const pourcentageGain = useMemo(() => {
    return xpLevel !== undefined ? (xpTotal / xpLevel) * 100 : 0;
  }, [xpLevel, xpTotal]);

  const duelXp = useMemo(
    () =>
      xp
        ? [
            {
              color: Colors.pink,
              title: t("commun.match"),
              value: xp.match,
            },
            {
              color: Colors.yellow,
              title: t("commun.matchscore"),
              value: xp.matchscore,
            },
            {
              color: Colors.green,
              title: t("commun.victorybonus"),
              value: xp.victorybonus,
            },
            {
              color: Colors.purple2,
              title: t("commun.totalxp"),
              value: xpTotal,
            },
          ]
        : [],
    [t, xp, xpTotal]
  );

  return (
    xp && (
      <Grid container spacing={1} justifyContent="center" alignItems="end">
        <Grid item>
          <Typography variant="h4">
            {t("commun.level")} {myLevel}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {xpLevel !== undefined && myXpLevel !== undefined && (
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  zIndex: 1,
                  color: Colors.black,
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  color={isDarkMode ? Colors.black2 : Colors.white}
                >
                  {xpLevel - myXpLevel}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  color={isDarkMode ? Colors.black2 : Colors.white}
                >
                  {t("commun.xpnextlevel")}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                height: px(20),
                width: percent(100),
                backgroundColor: isDarkMode ? Colors.white : Colors.black2,
                borderRadius: px(25),
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                width: percent(100),
                display: "flex",
              }}
            >
              <Box
                sx={{
                  height: px(20),
                  width: percent(pourcentage > 0 ? pourcentage : 0),
                  backgroundColor: Colors.blue3,
                  borderTopLeftRadius: px(25),
                  borderBottomLeftRadius: px(25),
                }}
              />
              <Box
                sx={{
                  height: px(20),
                  width: percent(pourcentageGain),
                  backgroundColor: Colors.purple2,
                  borderTopLeftRadius: pourcentage > 0 ? "none" : px(25),
                  borderBottomLeftRadius: pourcentage > 0 ? "none" : px(25),
                }}
              />
            </Box>
          </Box>
        </Grid>
        {duelXp.map((el, index) => (
          <Grid item xs={3} key={index}>
            <ExperienceGainBlock
              color={el.color}
              title={el.title}
              value={el.value}
            />
          </Grid>
        ))}
      </Grid>
    )
  );
};

interface PropsSolo {
  xp?: ExtraSoloGameXP;
}

export const MyExperienceSoloBlock = ({ xp }: PropsSolo) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [profile]);

  const xpTotal = useMemo(() => {
    return xp ? xp.match + xp.matchscore : 0;
  }, [xp]);

  const myLevel = useMemo(() => {
    return stat !== undefined ? getLevel(stat.xp) : undefined;
  }, [stat]);

  const xpLevel = useMemo(() => {
    const lvlCurrent =
      myLevel !== undefined ? getExperienceByLevel(myLevel) : 0;
    const lvlNext =
      myLevel !== undefined ? getExperienceByLevel(myLevel + 1) : 0;
    return myLevel !== undefined ? lvlNext - lvlCurrent : undefined;
  }, [myLevel]);

  const myXpLevel = useMemo(() => {
    const lvlCurrent =
      myLevel !== undefined ? getExperienceByLevel(myLevel) : 0;
    return myLevel !== undefined && stat !== undefined
      ? stat.xp - lvlCurrent
      : undefined;
  }, [myLevel, stat]);

  const pourcentage = useMemo(() => {
    return xpLevel !== undefined && myXpLevel !== undefined
      ? ((myXpLevel - xpTotal) / xpLevel) * 100
      : 0;
  }, [xpLevel, myXpLevel, xpTotal]);

  const pourcentageGain = useMemo(() => {
    return xpLevel !== undefined ? (xpTotal / xpLevel) * 100 : 0;
  }, [xpLevel, xpTotal]);

  const duelXp = useMemo(
    () =>
      xp
        ? [
            {
              color: Colors.pink,
              title: t("commun.match"),
              value: xp.match,
            },
            {
              color: Colors.yellow,
              title: t("commun.matchscore"),
              value: xp.matchscore,
            },
            {
              color: Colors.purple2,
              title: t("commun.totalxp"),
              value: xpTotal,
            },
          ]
        : [],
    [t, xp, xpTotal]
  );

  return (
    xp &&
    profile !== null && (
      <Grid container spacing={1} justifyContent="center" alignItems="end">
        {profile && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <AvatarAccountBadge
              profile={profile}
              size={100}
              color={Colors.pink}
            />
          </Grid>
        )}
        <Grid item>
          <Typography variant="h4">
            {t("commun.level")} {myLevel}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {xpLevel !== undefined && myXpLevel !== undefined && (
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  color={isDarkMode ? Colors.black2 : Colors.white}
                >
                  {xpLevel - myXpLevel}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  color={isDarkMode ? Colors.black2 : Colors.white}
                >
                  {t("commun.xpnextlevel")}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                height: px(20),
                width: percent(100),
                backgroundColor: isDarkMode ? Colors.white : Colors.black2,
                borderRadius: px(25),
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                width: percent(100),
                display: "flex",
              }}
            >
              <Box
                sx={{
                  height: px(20),
                  width: percent(pourcentage > 0 ? pourcentage : 0),
                  backgroundColor: Colors.blue3,
                  borderTopLeftRadius: px(25),
                  borderBottomLeftRadius: px(25),
                }}
              />
              <Box
                sx={{
                  height: px(20),
                  width: percent(pourcentageGain),
                  backgroundColor: Colors.purple2,
                  borderTopLeftRadius: pourcentage > 0 ? "none" : px(25),
                  borderBottomLeftRadius: pourcentage > 0 ? "none" : px(25),
                }}
              />
            </Box>
          </Box>
        </Grid>
        {duelXp.map((el, index) => (
          <Grid item xs={4} key={index}>
            <ExperienceGainBlock
              color={el.color}
              title={el.title}
              value={el.value}
            />
          </Grid>
        ))}
      </Grid>
    )
  );
};

interface PropsExperienceGainBlock {
  title: string;
  color: string;
  value: number;
}
const ExperienceGainBlock = ({
  title,
  color,
  value,
}: PropsExperienceGainBlock) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: px(2),
      }}
    >
      <Typography variant="h6" textTransform="uppercase">
        {title}
      </Typography>
      <Box
        sx={{
          p: padding(5, 15),
          border: `2px solid ${color}`,
          borderRadius: px(5),
        }}
      >
        <Typography variant="h4" sx={{ color: color }} component="span">
          +{value}
        </Typography>
        <Typography variant="caption" sx={{ color: color }} component="span">
          {t("commun.xpabbreviation")}
        </Typography>
      </Box>
    </Box>
  );
};
