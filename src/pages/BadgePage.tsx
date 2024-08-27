import { Avatar, Box, Container, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectBadgeById } from "src/api/badge";
import { ButtonColor } from "src/component/Button";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Badge } from "src/models/Badge";
import { Colors } from "src/style/Colors";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function BadgePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { accomplishments, myaccomplishments } = useApp();
  const { user } = useAuth();

  const [badge, setBadge] = useState<Badge | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getBadge = () => {
      if (id) {
        selectBadgeById(Number(id)).then(({ data }) => {
          setBadge(data as Badge);
        });
      }
    };
    getBadge();
  }, [id]);

  useEffect(() => {
    const getMyStat = () => {
      if (user) {
        selectStatAccomplishmentByProfile(user.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [user]);

  const accomplishment = useMemo(
    () =>
      badge
        ? accomplishments.find((el) => el.badge && el.badge.id === badge.id)
        : undefined,
    [accomplishments, badge]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.badge.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("pages.badge.title")} quit={() => navigate(-1)} />
      <Grid item xs={12}>
        <Container maxWidth="lg">
          <Box sx={{ p: 1, mt: 3 }}>
            <Grid container spacing={2} justifyContent="center">
              {badge && (
                <Grid item>
                  <Avatar
                    sx={{
                      width: 200,
                      height: 200,
                    }}
                    src={badge.icon}
                  />
                </Grid>
              )}

              {accomplishment && (
                <Grid item xs={12}>
                  <CardAccomplishment
                    accomplishment={accomplishment}
                    stat={stat}
                    isFinish={myaccomplishments.includes(accomplishment.id)}
                    title
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Container>
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <ButtonColor
              value={Colors.yellow}
              label={t("commun.goaccomplishments")}
              icon={EmojiEventsIcon}
              variant="contained"
              onClick={() => {
                if (user) navigate(`/accomplishments/${user.id}`);
              }}
            />
            <ButtonColor
              value={Colors.blue3}
              label={t("commun.return")}
              icon={KeyboardReturnIcon}
              variant="contained"
              onClick={() => navigate(-1)}
            />
          </Box>
        </Container>
      </Box>
    </Grid>
  );
}
