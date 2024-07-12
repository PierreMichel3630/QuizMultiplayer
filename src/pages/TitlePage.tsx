import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Box, Container, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectTitleById } from "src/api/title";
import { BadgeTitle } from "src/component/Badge";
import { ButtonColor } from "src/component/Button";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";

export default function TitlePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { accomplishments, myaccomplishments } = useApp();
  const { user } = useAuth();

  const [title, setTitle] = useState<Title | undefined>(undefined);
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getTitle = () => {
      if (id) {
        selectTitleById(Number(id)).then(({ data }) => {
          setTitle(data as Title);
        });
      }
    };
    getTitle();
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
        <Container maxWidth="lg">
          <Box sx={{ p: 1, mt: 3 }}>
            <Grid container spacing={2} justifyContent="center">
              {title && (
                <Grid item>
                  <BadgeTitle label={title.name} />
                </Grid>
              )}

              {accomplishment && (
                <Grid item xs={12}>
                  <CardAccomplishment
                    accomplishment={accomplishment}
                    stat={stat}
                    isFinish={myaccomplishments.includes(accomplishment.id)}
                    badge
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
              onClick={() => navigate("/accomplishments")}
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
