import { Box, Divider, Grid, Typography } from "@mui/material";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";

import { Dictionary, groupBy } from "lodash";
import {
  selectAccomplishment,
  selectStatAccomplishmentByProfile,
} from "src/api/accomplishment";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { Accomplishment, StatAccomplishment } from "src/models/Accomplishment";

import award from "src/assets/award.png";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";
import { px } from "csx";

export default function AccomplishmentPage() {
  const { t } = useTranslation();
  const { myaccomplishments, headerSize } = useApp();
  const { profile } = useAuth();
  const [accomplishments, setAccomplishments] = useState<Array<Accomplishment>>(
    []
  );
  const [accomplishmentsGroupBy, setAccomplishmentsGroupBy] = useState<
    Dictionary<Array<Accomplishment>>
  >({});
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  const accomplishmentsToUnlock = useMemo(() => {
    const ids = myaccomplishments
      .filter((el) => !el.validate)
      .map((el) => el.accomplishment.id);
    return accomplishments.filter((el) => ids.includes(el.id));
  }, [accomplishments, myaccomplishments]);

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
    setAccomplishmentsGroupBy(groupBy(accomplishments, "type"));
  }, [accomplishments]);

  useEffect(() => {
    const getAccomplishments = () => {
      selectAccomplishment().then(({ data }) => {
        const value = data !== null ? (data as Array<Accomplishment>) : [];
        setAccomplishments(value);
      });
    };
    getAccomplishments();
  }, []);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.accomplishments.title")} - ${t("appname")}`}</title>
        <meta
          name="description"
          content="Collectionner tous les succès à travers des défis amusants"
        />
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                {accomplishmentsToUnlock.map((accomplishment) => {
                  return (
                    <Grid item xs={12} lg={6} key={accomplishment.id}>
                      <CardAccomplishment
                        accomplishment={accomplishment}
                        stat={stat}
                        badge
                        title
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            {Object.keys(accomplishmentsGroupBy).map((el, index) => {
              const accomplishments = accomplishmentsGroupBy[el];
              const myaccomplishmentsMode = accomplishments.filter((el) =>
                myaccomplishments
                  .map((r) => r.accomplishment.id)
                  .includes(el.id)
              );
              const percent =
                accomplishments.length > 0
                  ? (myaccomplishmentsMode.length / accomplishments.length) *
                    100
                  : 0;
              return (
                <Fragment key={index}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      position: "sticky",
                      top: headerSize,
                      backgroundColor: "background.paper",
                      pb: px(10),
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 5,
                        backgroundColor: Colors.black,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 3,
                        border: "2px solid white",
                      }}
                    >
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <img src={award} width={40} loading="lazy" />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h2" color="text.secondary">
                            {t(`accomplishment.${el}`)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h2"
                                color="text.secondary"
                                component="span"
                              >
                                {myaccomplishmentsMode.length}
                              </Typography>
                              <Typography
                                variant="h6"
                                color="text.secondary"
                                component="span"
                              >
                                /{accomplishments.length}
                              </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                              {`${percent.toFixed(2)} ${t(
                                "commun.percentsuccess"
                              )}`}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  {accomplishments.map((accomplishment) => {
                    return (
                      <Grid item xs={12} md={6} key={accomplishment.id}>
                        <CardAccomplishment
                          accomplishment={accomplishment}
                          stat={stat}
                          badge
                          title
                        />
                      </Grid>
                    );
                  })}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Fragment>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
