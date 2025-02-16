import { Box, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { TitleBlock } from "src/component/title/Title";

import { viewHeight } from "csx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { launchWheel } from "src/api/wheel";
import { TimeLeftBlock } from "src/component/TimeLeftBlock";
import { AnimateWheel } from "src/component/Wheel";
import { useAuth } from "src/context/AuthProviderSupabase";
import { WheelResult } from "src/models/Wheel";

export default function WheelPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [launch, setLaunch] = useState(false);
  const [wheelResult, setWheelResult] = useState<undefined | WheelResult>(
    undefined
  );

  console.log(wheelResult);

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
            <AnimateWheel launch={launch} />
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
                      setLaunch(true);
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
    </Box>
  );
}
