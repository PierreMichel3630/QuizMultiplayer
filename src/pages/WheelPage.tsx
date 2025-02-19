import { Backdrop, Box, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { TitleBlock } from "src/component/title/Title";

import { viewHeight } from "csx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { launchWheel } from "src/api/wheel";
import { AddMoneyBlock, MoneyBlock } from "src/component/MoneyBlock";
import { TimeLeftBlock } from "src/component/TimeLeftBlock";
import { Wheel } from "src/component/wheel/Wheel";
import { AddXpImageBlock, XpImageBlock } from "src/component/XpBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { TypeWheelEnum } from "src/models/enum/TypeWheelEnum";
import { WheelResult } from "src/models/Wheel";
import { Colors } from "src/style/Colors";

import ForwardIcon from "@mui/icons-material/Forward";

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

  const onClose = () => {
    refreshProfil();
    setOpen(false);
  };

  const onFinish = () => {
    setOpen(true);
    setTimeout(() => {
      onClose();
    }, 4000);
  };

  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: viewHeight(100),
          minHeight: viewHeight(100),
          p: 0,
        }}
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <MoneyBlock
                    money={wheelResult.money.previous}
                    variant="h2"
                    width={22}
                  />
                  <ForwardIcon fontSize="large" />
                  <MoneyBlock
                    money={wheelResult.money.actual}
                    variant="h2"
                    width={22}
                  />
                </Box>
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <XpImageBlock
                    xp={wheelResult.xp.previous}
                    variant="h2"
                    width={22}
                  />
                  <ForwardIcon fontSize="large" />
                  <XpImageBlock
                    xp={wheelResult.xp.actual}
                    variant="h2"
                    width={22}
                  />
                </Box>
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
    </Box>
  );
}
