import { Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { BadgeLevel } from "src/icons/BadgeLevel";
import { StatAccomplishment } from "src/models/Accomplishment";
import { ExtraSoloGameXP } from "src/models/Game";
import { Colors } from "src/style/Colors";
import { getExperienceByLevel, getLevel } from "src/utils/calcul";
import { POINTGAME, POINTVICTORY } from "src/utils/config";
import { ProfileBlock } from "./profile/ProfileBlock";

import { motion, useAnimationControls } from "framer-motion";

interface Props {
  xp: number;
  xpgain?: number;
}

export const ExperienceBlock = ({ xp, xpgain = 0 }: Props) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const HEIGHT = 20;

  const totalXp = useMemo(() => xp + xpgain, [xp, xpgain]);

  const myLevel = useMemo(() => {
    return getLevel(xp);
  }, [xp]);

  const xpLevel = useMemo(() => {
    const lvlCurrent =
      myLevel === undefined ? 0 : getExperienceByLevel(myLevel);
    const lvlNext =
      myLevel === undefined ? 0 : getExperienceByLevel(myLevel + 1);
    return myLevel === undefined ? undefined : lvlNext - lvlCurrent;
  }, [myLevel]);

  const myXpLevel = useMemo(() => {
    const lvlCurrent =
      myLevel === undefined ? 0 : getExperienceByLevel(myLevel);
    console.log(lvlCurrent);
    return myLevel === undefined ? undefined : totalXp - lvlCurrent;
  }, [myLevel, totalXp]);

  const pourcentage = useMemo(() => {
    return xpLevel !== undefined && myXpLevel !== undefined
      ? ((myXpLevel - xpgain) / xpLevel) * 100
      : 0;
  }, [xpLevel, myXpLevel, xpgain]);

  const pourcentageGain = useMemo(() => {
    return xpLevel === undefined ? 0 : (xpgain / xpLevel) * 100;
  }, [xpLevel, xpgain]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ zIndex: 2 }}>
        <BadgeLevel level={myLevel} size={38} fontSize={17} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          height: px(HEIGHT),
          marginLeft: "-10px",
        }}
      >
        <Box
          sx={{
            width: percent(100),
            backgroundColor: isDarkMode ? Colors.white : Colors.black2,
            borderRadius: px(25),
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {xpLevel !== undefined && myXpLevel !== undefined && (
            <Box sx={{ zIndex: 100, position: "absolute" }}>
              <Typography
                variant="h6"
                component="span"
                color={isDarkMode ? Colors.black2 : Colors.white}
              >
                {myXpLevel} / {xpLevel}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              left: 0,
              height: percent(100),
              width: percent(100),
              display: "flex",
            }}
          >
            <Box
              sx={{
                height: percent(100),
                width: percent(Math.max(pourcentage, 0)),
                backgroundColor: Colors.colorApp,
                borderTopLeftRadius: px(25),
                borderBottomLeftRadius: px(25),
              }}
            />
            <Box
              sx={{
                height: percent(100),
                width: percent(pourcentageGain),
                backgroundColor: Colors.purple2,
                borderTopLeftRadius: pourcentage > 0 ? "none" : px(25),
                borderBottomLeftRadius: pourcentage > 0 ? "none" : px(25),
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
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

  const [xp, setXp] = useState<number | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          if (data) {
            const res = data as StatAccomplishment;
            setXp(res.xp);
          }
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
    [t, victory, score, xpTotal],
  );

  return (
    <Grid container spacing={1} justifyContent="center" alignItems="end">
      {xp !== undefined && (
        <Grid size={12}>
          <ExperienceBlock xp={xp} xpgain={xpTotal} />
        </Grid>
      )}
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
  xpExtra?: ExtraSoloGameXP;
}

export const MyExperienceSoloBlock = ({ xpExtra }: PropsSolo) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [xp, setXp] = useState<number | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          if (data) {
            const res = data as StatAccomplishment;
            setXp(res.xp);
          }
        });
      }
    };
    getMyStat();
  }, [profile]);

  const xpTotal = useMemo(() => {
    return xpExtra
      ? (xpExtra.match ?? 0) + (xpExtra.matchscore ?? 0) + (xpExtra.record ?? 0)
      : 0;
  }, [xpExtra]);

  const duelXp = useMemo(() => {
    if (!xpExtra) return [];

    return [
      xpExtra.record !== undefined && {
        color: Colors.green,
        title: t("commun.record"),
        value: xpExtra.record,
      },
      xpExtra.match !== undefined && {
        color: Colors.pink,
        title: t("commun.match"),
        value: xpExtra.match,
      },
      xpExtra.matchscore !== undefined && {
        color: Colors.yellow,
        title: t("commun.matchscore"),
        value: xpExtra.matchscore,
      },
      {
        color: Colors.purple2,
        title: t("commun.totalxp"),
        value: xpTotal,
      },
    ].filter(Boolean) as Array<{ color: string; title: string; value: number }>;
  }, [t, xpExtra, xpTotal]);

  return (
    xp &&
    profile !== null && (
      <Grid container spacing={1} justifyContent="center" alignItems="end">
        {profile && (
          <Grid size={12}>
            <ProfileBlock profile={profile} />
          </Grid>
        )}
        {xp !== undefined && (
          <Grid size={12}>
            <ExperienceBlock xp={xp} xpgain={xpTotal} />
          </Grid>
        )}
        {duelXp.map((el, index) => (
          <Grid key={index} size={12 / duelXp.length}>
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
          p: px(5),
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

const XP_PER_LEVEL = 1000;

export const XPBar = ({ xp, xpgain = 0 }: Props) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const [level, setLevel] = useState(getLevel(xp));
  const controlsBlue = useAnimationControls();
  const controlsPurple = useAnimationControls();

  const HEIGHT = 20;

  // Calcul des pourcentages initiaux
  const currentXPPct = (xp / XP_PER_LEVEL) * 100;

  useEffect(() => {
    if (xpgain > 0) {
      setInterval(() => {
        animateXP();
      }, 10000);
    }
  }, [xpgain]);

  const animateXP = async () => {
    let remainingXPToAnimate = xpgain;
    let currentXP = xp;
    let currentLevel = getLevel(xp);

    // 1. Initialiser la barre bleue à sa position actuelle (sans animation)
    controlsBlue.set({ width: `${currentXPPct}%` });
    controlsPurple.set({ width: `${currentXPPct}%`, opacity: 0 });

    // Attendre un court instant avant de lancer l'animation du gain
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Boucle au cas où le gain d'XP fait monter de plusieurs niveaux
    while (remainingXPToAnimate > 0) {
      const xpNeededForNextLevel = XP_PER_LEVEL - currentXP;

      // Est-ce qu'on va monter de niveau ?
      if (remainingXPToAnimate >= xpNeededForNextLevel) {
        // Étape A: Animer la barre violette jusqu'au bout du niveau (100%)
        controlsPurple.set({ opacity: 1 });
        await controlsPurple.start({
          width: "100%",
          transition: { duration: 0.8, ease: "easeOut" },
        });

        // Étape B: Level UP ! On met à jour l'état visuel
        currentLevel += 1;
        setLevel(currentLevel);
        remainingXPToAnimate -= xpNeededForNextLevel;
        currentXP = 0;

        // Étape C: Réinitialisation flash des deux barres à 0%
        controlsBlue.set({ width: "0%" });
        controlsPurple.set({ width: "0%", opacity: 0 });
      } else {
        // Pas de level up, on anime juste le reste du gain
        const finalXPInLevel = currentXP + remainingXPToAnimate;
        const finalPct = (finalXPInLevel / XP_PER_LEVEL) * 100;

        // On affiche la barre violette et on l'anime jusqu'à la destination finale
        controlsPurple.set({ opacity: 1 });
        await controlsPurple.start({
          width: `${finalPct}%`,
          transition: { duration: 0.6, ease: "easeOut" },
        });

        // Une fois l'animation violette finie, la barre bleue "absorbe" cette XP
        controlsBlue.set({ width: `${finalPct}%` });
        controlsPurple.set({ opacity: 0 });

        remainingXPToAnimate = 0;
      }
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ zIndex: 2 }}>
        <BadgeLevel level={level} size={38} fontSize={17} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          height: px(HEIGHT),
          marginLeft: "-10px",
        }}
      >
        <Box
          sx={{
            width: percent(100),
            backgroundColor: isDarkMode ? Colors.white : Colors.black2,
            borderRadius: px(25),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            animate={controlsBlue}
            sx={{
              backgroundColor: Colors.colorApp,
              height: percent(100),
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "12px",
              zIndex: 2,
            }}
          />

          <Box
            component={motion.div}
            animate={controlsPurple}
            sx={{
              height: percent(100),
              backgroundColor: Colors.purple2,
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "12px",
              zIndex: 2,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
