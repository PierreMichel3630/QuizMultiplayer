import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
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
import { useMessage } from "src/context/MessageProvider";
import { buyItem } from "src/api/buy";
import { ProfilHeader } from "src/component/ProfileHeader";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import moneyIcon from "src/assets/money.svg";
import { padding, px } from "csx";

export default function BannerPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfil } = useAuth();
  const { mybadges, getMyBadges, accomplishments } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [badge, setBadge] = useState<Badge | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getBadge = () => {
      setLoading(true);
      if (id) {
        selectBadgeById(Number(id)).then(({ data }) => {
          setBadge(data as Badge);
          setLoading(false);
        });
      }
    };
    getBadge();
  }, [id]);

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

  const verifyBuy = () => {
    if(profile) {
      if ( badge) {
        if (profile.money < badge.price) {
          setSeverity("error");
          setMessage(t("alert.noenoughtmoney"));
        } else {
          setOpenModal(true);
        }
      } else {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    }  else {
      navigate(`/login`);
    }
  };
  

  const buy = () => {
    if (profile && badge) {
      if (profile.money < badge.price) {
        setSeverity("error");
        setMessage(t("alert.noenoughtmoney"));
      } else {
        buyItem("avatar", badge.id).then((_res) => {
          setSeverity("success");
          setMessage(t("alert.buyitem"));
          getMyBadges();
          refreshProfil();
        });
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
    setOpenModal(false);
  };

  const isBuy = useMemo(
    () =>
      !loading &&
      badge &&
      mybadges.find((el) => el.id === badge.id) !== undefined,
    [loading, mybadges, badge]
  );

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
        <Container maxWidth="md">
          {badge && profile && (
            <ProfilHeader profile={profile} badge={badge.icon} />
          )}
        </Container>
      </Grid>

      <Grid item xs={12}>
        <Container maxWidth="md" sx={{ mt: 2, mb: 12 }}>
          {badge && (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                  }}
                  src={badge.icon}
                />
              </Grid>

              {accomplishment && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2 }}>
                    <CardAccomplishment
                      accomplishment={accomplishment}
                      stat={stat}
                      badge
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "background.paper",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            {!loading && badge && !isBuy && !badge.isaccomplishment && (
              <Box
                sx={{
                  backgroundColor: Colors.yellow2,
                  p: padding(2, 5),
                  borderRadius: px(5),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={verifyBuy}
              >
                <Typography variant="caption" color="text.secondary">
                  {t("commun.buy")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h2" color="text.secondary">
                    {badge.price}
                  </Typography>
                  <img src={moneyIcon} width={25} />
                </Box>
              </Box>
            )}

            {badge && badge.isaccomplishment && (
              <ButtonColor
                value={Colors.yellow}
                label={t("commun.goaccomplishments")}
                icon={EmojiEventsIcon}
                variant="contained"
                onClick={() => {
                  navigate(`/accomplishments`);
                }}
              />
            )}
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

      <ConfirmDialog
        title={t("commun.confirmbuy")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={buy}
      />
    </Grid>
  );
}
