import DirectionsIcon from "@mui/icons-material/Directions";
import NotesIcon from "@mui/icons-material/Notes";
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

export default function NewsPage() {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
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
              <NotesIcon fontSize="large" />
              <Typography variant="h2">{t("commun.patchnote")}</Typography>
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
