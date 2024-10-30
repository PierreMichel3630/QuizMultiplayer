import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  Avatar as AvatarMat,
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { padding, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectAvatarById } from "src/api/avatar";
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
import { Avatar } from "src/models/Avatar";
import { Colors } from "src/style/Colors";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function AvatarPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, refreshProfil } = useAuth();
  const { myavatars, getMyAvatars, accomplishments } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [avatar, setAvatar] = useState<Avatar | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const getAvatar = () => {
      setLoading(true);
      if (id) {
        selectAvatarById(Number(id)).then(({ data }) => {
          setAvatar(data as Avatar);
          setLoading(false);
        });
      }
    };
    getAvatar();
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
    if (profile && avatar) {
      if (profile.money < avatar.price) {
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
    if (profile && avatar) {
      if (profile.money < avatar.price) {
        setSeverity("error");
        setMessage(t("alert.noenoughtmoney"));
      } else {
        buyItem("avatar", avatar.id).then((_res) => {
          setSeverity("success");
          setMessage(t("alert.buyitem"));
          getMyAvatars();
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
      avatar &&
      myavatars.find((el) => el.id === avatar.id) !== undefined,
    [loading, myavatars, avatar]
  );

  const accomplishment = useMemo(
    () =>
      avatar && avatar.isaccomplishment
        ? accomplishments.find((el) => el.avatar && el.avatar.id === avatar.id)
        : undefined,
    [accomplishments, avatar]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.avatar.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation
        title={t("pages.avatar.title")}
        quit={() => navigate(-1)}
      />
      <Grid item xs={12}>
        <Container maxWidth="md">
          {avatar && profile && (
            <ProfilHeader profile={profile} avatar={avatar.icon} />
          )}
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="md" sx={{ mt: 2, mb: 12 }}>
          {avatar && (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <AvatarMat
                  alt="Avatar"
                  src={avatar.icon}
                  sx={{
                    width: 180,
                    height: 180,
                    backgroundColor: Colors.grey2,
                  }}
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
            {!loading && avatar && !isBuy && !avatar.isaccomplishment && (
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
                    {avatar.price}
                  </Typography>
                  <img src={moneyIcon} width={25} />
                </Box>
              </Box>
            )}
            {avatar && avatar.isaccomplishment && (
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
