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

type XPSegment = {
  fromPercent: number;
  toPercent: number;
  level: number;
};

interface Props {
  xp: number;
  xpgain?: number;
}

export const ExperienceBlock = ({ xp, xpgain = 0 }: Props) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const HEIGHT = 20;

  const controls = useAnimationControls();

  const [level, setLevel] = useState(getLevel(xp));
  const [percentXpBase, setPercentXpBase] = useState(0);
  const [labelXp, setLabelXp] = useState("");
  const [animationIsFinish, setAnimationIsFinish] = useState(false);

  useEffect(() => {
    const myLevel = getLevel(xp);
    const lvlCurrent =
      myLevel === undefined ? 0 : getExperienceByLevel(myLevel);
    const lvlNext =
      myLevel === undefined ? 0 : getExperienceByLevel(myLevel + 1);

    const xpLevel = lvlNext - lvlCurrent;

    const myXpLevel = xp - lvlCurrent;
    setLabelXp(`${Math.floor(myXpLevel)} / ${Math.floor(xpLevel)}`);

    const pourcentage = (myXpLevel / xpLevel) * 100;
    setPercentXpBase(pourcentage);
  }, [xp]);

  const buildXPSegments = (xp: number, xpGain: number) => {
    const segments: XPSegment[] = [];

    let remaining = xpGain;
    let currentXp = xp;

    while (remaining > 0) {
      const level = getLevel(currentXp);

      const start = getExperienceByLevel(level);
      const end = getExperienceByLevel(level + 1);

      const xpInLevel = currentXp - start;
      const xpLeftInLevel = end - currentXp;

      const gainInThisLevel = Math.min(remaining, xpLeftInLevel);

      const fromPercent = (xpInLevel / (end - start)) * 100;
      const toPercent = ((xpInLevel + gainInThisLevel) / (end - start)) * 100;

      segments.push({
        level,
        fromPercent,
        toPercent,
      });

      remaining -= gainInThisLevel;
      currentXp += gainInThisLevel;
    }

    return segments;
  };

  useEffect(() => {
    const segments = buildXPSegments(xp, xpgain);

    async function run() {
      setAnimationIsFinish(false);
      for (const [index, seg] of segments.entries()) {
        if (index === segments.length - 1) {
          setAnimationIsFinish(true);
        }
        const target = seg.toPercent - seg.fromPercent;
        setLevel(seg.level);

        controls.set({
          width: "0%",
          left: `${seg.fromPercent}%`,
        });

        await new Promise(requestAnimationFrame);

        await controls.start({
          width: `${target}%`,
          transition: {
            duration: 2,
            ease: "easeOut",
          },
        });
        if (segments.length > 1) {
          setPercentXpBase(0);
        }
      }
    }

    if (segments.length > 0) {
      run();
    } else {
      setAnimationIsFinish(true);
    }
  }, [controls, xp, xpgain]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", pl: 1, pr: 1 }}>
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
            position: "relative",
            width: percent(100),
            backgroundColor: isDarkMode ? Colors.white : Colors.black2,
            borderRadius: px(25),
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {animationIsFinish && (
            <Box sx={{ zIndex: 100, position: "absolute" }}>
              <Typography
                variant="h6"
                component="span"
                color={isDarkMode ? Colors.black2 : Colors.white}
              >
                {labelXp}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: percent(100),
              width: percent(Math.max(percentXpBase, 0)),
              backgroundColor: Colors.colorApp,
            }}
          />
          <motion.div
            animate={controls}
            initial={false}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              backgroundColor: Colors.purple2,
            }}
          />
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
