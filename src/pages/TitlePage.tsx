import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Box, Container, Grid, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { buyItem } from "src/api/buy";
import { selectTitleById } from "src/api/title";
import moneyIcon from "src/assets/money.svg";
import { BadgeTitle } from "src/component/Badge";
import { ButtonColor } from "src/component/Button";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ProfilHeader } from "src/component/ProfileHeader";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";

export default function TitlePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfil } = useAuth();
  const { mytitles, getMyTitles, accomplishments } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [title, setTitle] = useState<Title | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getTitle = () => {
      setLoading(true);
      if (id) {
        selectTitleById(Number(id)).then(({ data }) => {
          setTitle(data as Title);
          setLoading(false);
        });
      }
    };
    getTitle();
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
    if (profile && title) {
      if (profile.money < title.price) {
        setSeverity("error");
        setMessage(t("alert.noenoughtmoney"));
      } else {
        setOpenModal(true);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const buy = () => {
    if (profile && title) {
      if (profile.money < title.price) {
        setSeverity("error");
        setMessage(t("alert.noenoughtmoney"));
      } else {
        buyItem("title", title.id).then((_res) => {
          setSeverity("success");
          setMessage(t("alert.buyitem"));
          getMyTitles();
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
      title &&
      mytitles.find((el) => el.id === title.id) !== undefined,
    [loading, mytitles, title]
  );

  const accomplishment = useMemo(
    () =>
      title
        ? accomplishments.find((el) => el.title && el.title.id === title.id)
        : undefined,
    [accomplishments, title]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.title.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("pages.title.title")} quit={() => navigate(-1)} />

      <Grid item xs={12}>
        <Container maxWidth="md">
          {title && profile && (
            <ProfilHeader profile={profile} title={title.name} />
          )}
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="md" sx={{ mb: 12 }}>
          {title && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <BadgeTitle label={title.name} />
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
            {!loading && title && !isBuy && !title.isaccomplishment && (
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
                    {title.price}
                  </Typography>
                  <img src={moneyIcon} width={25} />
                </Box>
              </Box>
            )}
            {title && title.isaccomplishment && (
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
