import DirectionsIcon from "@mui/icons-material/Directions";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNotification } from "src/context/NotificationProvider";
import { VERSION_APP } from "src/utils/config";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { UpdateAppButton } from "src/component/button/UpdateAppButton";
import { BarNavigation } from "src/component/navigation/BarNavigation";

export default function NewsPage() {
  const { t } = useTranslation();
  const { notificationUpdate } = useNotification();
  const navigate = useNavigate();

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <BarNavigation
          title={t("commun.patchnote")}
          quit={() => navigate(-1)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Typography variant="h4">{t("commun.appversion")}</Typography>
                <Typography variant="body1" sx={{ fontSize: 15 }}>
                  {VERSION_APP}
                </Typography>
              </Box>
              <InfoOutlinedIcon />
            </Grid>
            {notificationUpdate && (
              <Grid item xs={12}>
                <UpdateAppButton />
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <PatchNoteBlock />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DirectionsIcon fontSize="large" />
              <Typography variant="h2">{t("commun.roadmap")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <RoadmapBlock />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

interface PatchNote {
  version: string;
  changes: Array<string>;
  bug: Array<string>;
}
const PatchNoteBlock = () => {
  const { t } = useTranslation();

  const patchnotes: any = t("patchnote", { returnObjects: true });

  const versions = Object.keys(patchnotes).sort((a, b) => b.localeCompare(a));

  return (
    <Grid container spacing={2}>
      {versions.map((version) => {
        const data: PatchNote = patchnotes[version];

        return (
          <Grid item xs={12} key={version}>
            <Card elevation={5}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Version {data.version}
                </Typography>

                {/* Changes */}
                {data.changes && data.changes.length > 0 && (
                  <>
                    <Typography variant="h6">Améliorations</Typography>
                    <List>
                      {data.changes.map((change, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={change} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Bugs */}
                {data.bug && data.bug.length > 0 && (
                  <>
                    <Typography variant="h6">Corrections</Typography>
                    <List>
                      {data.bug.map((bug, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={bug} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

const RoadmapBlock = () => {
  const { t } = useTranslation();

  const features: Array<string> = t("roadmap.feature", { returnObjects: true });
  const bugs: Array<string> = t("roadmap.bug", { returnObjects: true });
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {t("commun.features")}
            </Typography>
            <List>
              {features.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {t("commun.bugs")}
            </Typography>
            <List>
              {bugs.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
