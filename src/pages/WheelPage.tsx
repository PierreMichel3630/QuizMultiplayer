import { Backdrop, Box, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { TitleBlock } from "src/component/title/Title";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { launchWheel } from "src/api/wheel";
import { AddMoneyBlock, MoneyBlock } from "src/component/MoneyBlock";
import { TimeLeftBlock } from "src/component/TimeLeftBlock";
import { Wheel } from "src/component/wheel/Wheel";
import { AddXpImageBlock } from "src/component/XpBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { TypeWheelEnum } from "src/models/enum/TypeWheelEnum";
import { WheelResult } from "src/models/Wheel";
import { Colors } from "src/style/Colors";

import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { AvatarAccountBadge } from "src/component/avatar/AvatarAccount";
import { ExperienceBlock } from "src/component/ExperienceBlock";
import { StatAccomplishment } from "src/models/Accomplishment";

export default function WheelPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode } = useUser();
  const { profile, refreshProfil } = useAuth();

  const [open, setOpen] = useState(false);
  const [wheelResult, setWheelResult] = useState<undefined | WheelResult>(
    undefined
  );
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [xp, setXp] = useState<number | undefined>(undefined);
  const [gainxp, setGainxp] = useState(0);
  const [money, setMoney] = useState(0);

  const options = [
    {
      value: "1000",
      color: Colors.red,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "50",
      color: Colors.black,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "500",
      color: Colors.pink,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "50",
      color: Colors.black,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "1000",
      color: Colors.orange,
      type: TypeWheelEnum.XP,
    },
    {
      value: "250",
      color: Colors.purple,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "5000",
      color: Colors.green,
      type: TypeWheelEnum.XP,
    },
    {
      value: "50",
      color: Colors.black,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "100",
      color: Colors.blue2,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "50",
      color: Colors.black,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "1000",
      color: Colors.orange,
      type: TypeWheelEnum.XP,
    },
    {
      value: "250",
      color: Colors.purple,
      type: TypeWheelEnum.GOLD,
    },
    {
      value: "50",
      color: Colors.black,
      type: TypeWheelEnum.GOLD,
    },
  ];

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          const stat = data as StatAccomplishment;
          setXp(stat.xp);
        });
        setMoney(profile.money);
      }
    };
    getMyStat();
  }, [profile]);

  const onClose = useCallback(() => {
    refreshProfil();
    setOpen(false);
    if (wheelResult) {
      const gain = wheelResult.xp.actual - wheelResult.xp.previous;
      setXp(wheelResult.xp.actual);
      setGainxp(gain);
      setMoney(wheelResult.money.actual);
    }
  }, [refreshProfil, wheelResult]);

  const onFinish = () => {
    setOpen(true);
    setTimeout(() => {
      onClose();
    }, 4000);
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 0,
        }}
        className="page"
      >
        <Helmet>
          <title>{`${t("pages.wheel.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 0",
            p: 1,
            flexDirection: "column",
            gap: 1,
          }}
        >
          <TitleBlock title={t("commun.rewardwheel")} />
          {profile && xp && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AvatarAccountBadge
                profile={profile}
                size={80}
                color={Colors.pink}
              />
              <ExperienceBlock xp={xp} xpgain={gainxp} />
              <MoneyBlock
                money={money}
                variant="h2"
                width={22}
                color="text.primary"
              />
            </Box>
          )}
          <Box
            sx={{
              p: 1,
              flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: "1 1 0",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={options}
                darkMode={mode === "dark"}
                onStopSpinning={() => {
                  onFinish();
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TimeLeftBlock
                intervalHours={12}
                lastDate={profile?.wheellaunch}
                onLaunch={() => {
                  if (profile) {
                    if (!mustSpin) {
                      launchWheel().then(({ data }) => {
                        const res: WheelResult = data;
                        setWheelResult(res);
                        if (res.option) {
                          const indexResult = options.findIndex(
                            (el) =>
                              el.value === res.option.value &&
                              el.type === res.option.type
                          );
                          setPrizeNumber(indexResult);
                          setMustSpin(true);
                        }
                      });
                    }
                  } else {
                    navigate("/login");
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={() => onClose()}
      >
        {wheelResult?.option && (
          <>
            {wheelResult.option.type === TypeWheelEnum.GOLD ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <AddMoneyBlock
                  money={wheelResult.option.value}
                  variant="h2"
                  width={40}
                  fontSize={35}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <AddXpImageBlock
                  xp={wheelResult.option.value}
                  variant="h2"
                  width={40}
                  fontSize={35}
                />
              </Box>
            )}
          </>
        )}
      </Backdrop>
    </>
  );
}
