import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Box, Container, Grid, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectBannerById } from "src/api/banner";
import { buyItem } from "src/api/buy";
import moneyIcon from "src/assets/money.svg";
import { ButtonColor } from "src/component/Button";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ProfilHeader } from "src/component/ProfileHeader";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Banner } from "src/models/Banner";
import { Colors } from "src/style/Colors";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function BannerPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfil } = useAuth();
  const { mybanners, getMyBanners, accomplishments } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [banner, setBanner] = useState<Banner | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getBanner = () => {
      setLoading(true);
      if (id) {
        selectBannerById(Number(id)).then(({ data }) => {
          setBanner(data as Banner);
          setLoading(false);
        });
      }
    };
    getBanner();
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
      if (banner) {
        if (profile.money < banner.price) {
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
      if (profile && banner) {
        if (profile.money < banner.price) {
          setSeverity("error");
          setMessage(t("alert.noenoughtmoney"));
        } else {
          buyItem("banner", banner.id).then((_res) => {
            setSeverity("success");
            setMessage(t("alert.buyitem"));
            getMyBanners();
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
      banner &&
      mybanners.find((el) => el.id === banner.id) !== undefined,
    [loading, mybanners, banner]
  );

  const accomplishment = useMemo(
    () =>
      banner
        ? accomplishments.find((el) => el.banner && el.banner.id === banner.id)
        : undefined,
    [accomplishments, banner]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.banner.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation
        title={t("pages.banner.title")}
        quit={() => navigate(-1)}
      />
      <Grid item xs={12}>
        <Container maxWidth="md">
          {banner && profile && (
            <ProfilHeader profile={profile} banner={banner.icon} />
          )}
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="md" sx={{ mb: 12 }}>
          {banner && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <img
                    src={`/banner/${banner.icon}`}
                    style={{
                      width: percent(100),
                    }}
                  />
                </Grid>

                {accomplishment && (
                  <Grid item xs={12}>
                    <CardAccomplishment
                      accomplishment={accomplishment}
                      stat={stat}
                      badge
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
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
            {!loading && banner && !isBuy && !banner.isaccomplishment && (
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
                    {banner.price}
                  </Typography>
                  <img src={moneyIcon} width={25} />
                </Box>
              </Box>
            )}
            {banner && banner.isaccomplishment && (
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
