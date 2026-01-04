import { Box, Grid, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { ExtraSoloGameXP } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { getExperienceByLevel, getLevel } from "src/utils/calcul";
import { POINTGAME, POINTVICTORY } from "src/utils/config";
import { AvatarAccountBadge } from "./avatar/AvatarAccount";

interface Props {
  xp: number;
  xpgain?: number;
}

export const ExperienceBlock = ({ xp, xpgain }: Props) => {
  const { t } = useTranslation();
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const xpTotal = useMemo(() => {
    return xpgain ?? 0;
  }, [xpgain]);

  const myLevel = useMemo(() => {
    return getLevel(xp);
  }, [xp]);

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
    return myLevel !== undefined ? xp - lvlCurrent : undefined;
  }, [myLevel, xp]);

  const pourcentage = useMemo(() => {
    return xpLevel !== undefined && myXpLevel !== undefined
      ? ((myXpLevel - xpTotal) / xpLevel) * 100
      : 0;
  }, [xpLevel, myXpLevel, xpTotal]);

  const pourcentageGain = useMemo(() => {
    return xpLevel !== undefined ? (xpTotal / xpLevel) * 100 : 0;
  }, [xpLevel, xpTotal]);

  return (
    <Grid container spacing={1} justifyContent="center" alignItems="end">
      <Grid>
        <Typography variant="h4">
          {t("commun.level")} {myLevel}
        </Typography>
      </Grid>
      <Grid size={12}>
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
                backgroundColor: Colors.colorApp,
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
    </Grid>
  );
};

interface PropsExperienceDuelBlock {
  victory: boolean;
  score: number;
}

export const ExperienceDuelBlock = ({
  victory,
  score,
}: PropsExperienceDuelBlock) => {
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
    const points = victory
      ? POINTVICTORY + POINTGAME + score
      : POINTGAME + score;
    return points;
  }, [victory, score]);

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
    () => [
      {
        color: Colors.pink,
        title: t("commun.match"),
        value: POINTGAME,
      },
      {
        color: Colors.yellow,
        title: t("commun.matchscore"),
        value: score,
      },
      {
        color: Colors.green,
        title: t("commun.victorybonus"),
        value: victory ? POINTVICTORY : 0,
      },
      {
        color: Colors.purple2,
        title: t("commun.totalxp"),
        value: xpTotal,
      },
    ],
    [t, victory, score, xpTotal]
  );

  return (
    <Grid container spacing={1} justifyContent="center" alignItems="end">
      <Grid>
        <Typography variant="h4">
          {t("commun.level")} {myLevel}
        </Typography>
      </Grid>
      <Grid size={12}>
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
                backgroundColor: Colors.colorApp,
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
        <Grid key={index} size={3}>
          <ExperienceGainBlock
            color={el.color}
            title={el.title}
            value={el.value}
          />
        </Grid>
      ))}
    </Grid>
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

  return (xp &&
  profile !== null && (<Grid container spacing={1} justifyContent="center" alignItems="end">
    {profile && (
      <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
        <AvatarAccountBadge
          profile={profile}
          size={100}
          color={Colors.pink}
        />
      </Grid>
    )}
    <Grid>
      <Typography variant="h4">
        {t("commun.level")} {myLevel}
      </Typography>
    </Grid>
    <Grid size={12}>
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
              backgroundColor: Colors.colorApp,
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
      <Grid key={index} size={4}>
        <ExperienceGainBlock
          color={el.color}
          title={el.title}
          value={el.value}
        />
      </Grid>
    ))}
  </Grid>));
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

interface PropsXpBar {
  previousxp: number;
  value: number;
}

export const XpBar = ({ previousxp, value }: PropsXpBar) => {
  const { t } = useTranslation();
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const newXp = useMemo(() => value + previousxp, [previousxp, value]);

  const myLevel = useMemo(() => getLevel(newXp), [newXp]);

  const experienceLevel = useMemo(
    () => getExperienceByLevel(myLevel),
    [myLevel]
  );
  const experienceNextLevel = useMemo(
    () => getExperienceByLevel(myLevel + 1),
    [myLevel]
  );

  const xpLevel = useMemo(() => {
    return experienceNextLevel - experienceLevel;
  }, [experienceNextLevel, experienceLevel]);

  const myXpLevel = useMemo(() => {
    return previousxp - experienceLevel;
  }, [previousxp, experienceLevel]);

  const gainXpLevel = useMemo(() => {
    return previousxp < experienceLevel
      ? value - (experienceLevel - previousxp)
      : value;
  }, [value, experienceLevel, previousxp]);

  const pourcentage = useMemo(() => {
    return (myXpLevel / xpLevel) * 100;
  }, [xpLevel, myXpLevel]);

  const pourcentageGain = useMemo(() => {
    return (gainXpLevel / xpLevel) * 100;
  }, [gainXpLevel, xpLevel]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: px(5),
        alignItems: "center",
      }}
    >
      <Typography variant="h4">
        {t("commun.level")} {myLevel}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          width: percent(100),
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
              {experienceNextLevel - newXp}
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
              backgroundColor: Colors.colorApp,
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
    </Box>
  );
};
