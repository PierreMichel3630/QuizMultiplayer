import { Backdrop, Box, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { TitleBlock } from "src/component/title/Title";

import { viewHeight } from "csx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { launchWheel } from "src/api/wheel";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { TimeLeftBlock } from "src/component/TimeLeftBlock";
import { AnimateWheel } from "src/component/Wheel";
import { AddXpImageBlock } from "src/component/XpBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { WheelResult } from "src/models/Wheel";
import { TypeWheelEnum } from "src/models/enum/TypeWheelEnum";

export default function WheelPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, refreshProfil } = useAuth();

  const [open, setOpen] = useState(false);
  const [wheelResult, setWheelResult] = useState<undefined | WheelResult>(
    undefined
  );

  const onClose = () => {
    refreshProfil();
    setOpen(false);
  };

  const onFinish = () => {
    setOpen(true);
    setTimeout(() => {
      refreshProfil();
      onClose();
    }, 2000);
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
            <AnimateWheel result={wheelResult?.option} onFinish={onFinish} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {profile?.wheellaunch && (
                <TimeLeftBlock
                  intervalHours={24}
                  lastDate={profile?.wheellaunch}
                  onLaunch={() => {
                    if (profile) {
                      launchWheel().then(({ data }) => {
                        setWheelResult(data);
                      });
                    } else {
                      navigate("/login");
                    }
                  }}
                />
              )}
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
              <AddMoneyBlock
                money={wheelResult.option.value}
                variant="h2"
                width={40}
                fontSize={35}
              />
            ) : (
              <AddXpImageBlock
                xp={wheelResult.option.value}
                variant="h2"
                width={40}
                fontSize={35}
              />
            )}
          </>
        )}
      </Backdrop>
    </Box>
  );
}
