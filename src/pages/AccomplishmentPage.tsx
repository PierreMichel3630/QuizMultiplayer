import { Box, Divider, Grid, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";

import { Dictionary, groupBy } from "lodash";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { CardAccomplishment } from "src/component/card/CardAccomplishment";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Accomplishment, StatAccomplishment } from "src/models/Accomplishment";

import award from "src/assets/award.png";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";

export const AccomplishmentPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { accomplishments, myaccomplishments, getMyAccomplishments } = useApp();

  const [accomplishmentsGroupBy, setAccomplishmentsGroupBy] = useState<
    Dictionary<Array<Accomplishment>>
  >({});
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

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

  useEffect(() => {
    setAccomplishmentsGroupBy(groupBy(accomplishments, "type"));
  }, [accomplishments]);

  useEffect(() => {
    getMyAccomplishments();
  }, []);

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.accomplishments.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        {Object.keys(accomplishmentsGroupBy).map((el, index) => {
          const accomplishments = accomplishmentsGroupBy[el];
          const myaccomplishmentsMode = accomplishments.filter((el) =>
            myaccomplishments.includes(el.id)
          );
          const percent =
            accomplishments.length > 0
              ? (myaccomplishmentsMode.length / accomplishments.length) * 100
              : 0;
          return (
            <Fragment key={index}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 5,
                    backgroundColor: Colors.black,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <img src={award} width={40} />
                    </Grid>
                    <Grid item xs>
                      <Typography
                        variant="h1"
                        fontSize={25}
                        color="text.secondary"
                      >
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
              {accomplishments.map((accomplishment) => (
                <Grid item xs={12} key={accomplishment.id}>
                  <CardAccomplishment
                    accomplishment={accomplishment}
                    stat={stat}
                    isFinish={myaccomplishments.includes(accomplishment.id)}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};
