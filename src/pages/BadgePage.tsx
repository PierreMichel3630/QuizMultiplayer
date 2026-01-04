import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectAccomplishmentByBadge,
  selectStatAccomplishmentByProfile,
} from "src/api/accomplishment";
import { selectBadgeById } from "src/api/badge";
import { buyItem } from "src/api/buy";
import moneyIcon from "src/assets/money.svg";
import { ButtonColor } from "src/component/Button";
import { ProfilHeader } from "src/component/ProfileHeader";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { Accomplishment, StatAccomplishment } from "src/models/Accomplishment";
import { Badge } from "src/models/Badge";
import { Colors } from "src/style/Colors";

export default function BadgePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfil } = useAuth();
  const { myBadges, getMyBadges } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [badge, setBadge] = useState<Badge | undefined>(undefined);
  const [accomplishment, setAccomplishment] = useState<
    Accomplishment | undefined
  >(undefined);
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

  useEffect(() => {
    const getAccomplishment = () => {
      if (badge) {
        selectAccomplishmentByBadge(badge.id).then(({ data }) => {
          setAccomplishment(data);
        });
      }
    };
    getAccomplishment();
  }, [badge]);

  const verifyBuy = () => {
    if (profile) {
      if (badge) {
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
    } else {
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
      myBadges.find((el) => el.id === badge.id) !== undefined,
    [loading, myBadges, badge]
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
          <Grid item xs={12}>
            <Box
              sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
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
                    <img alt="money icon" src={moneyIcon} width={25} />
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
                value={Colors.colorApp}
                label={t("commun.return")}
                icon={KeyboardReturnIcon}
                variant="contained"
                onClick={() => navigate(-1)}
              />
            </Box>
          </Grid>
        </Container>
      </Grid>

      <ConfirmDialog
        title={t("commun.confirmbuy")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={buy}
      />
    </Grid>
  );
}
