import { Box, Divider, Grid, Typography } from "@mui/material";
import {
  Fragment,
  MutableRefObject,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { HeadTitle } from "src/component/HeadTitle";
import { useLocation } from "react-router-dom";

export default function AccomplishmentPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { accomplishments, myaccomplishments, getMyAccomplishments } = useApp();
  const { hash } = useLocation();

  const [accomplishmentsGroupBy, setAccomplishmentsGroupBy] = useState<
    Dictionary<Array<Accomplishment>>
  >({});
  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);
  const refs = useRef<Array<MutableRefObject<HTMLDivElement>>>([]);

  useEffect(() => {
    refs.current = accomplishments.map(
      (el) => refs.current[el.id] ?? createRef()
    );
  }, [accomplishments]);

  const executeScroll = useCallback(
    (hash: string) => {
      const id = Number(hash.slice(1));
      const indexAccomplishment = accomplishments.findIndex(
        (el) => el.id === id
      );
      const element = refs.current[indexAccomplishment];
      const top = element && element.current ? element.current.offsetTop : 0;
      window.scrollTo({
        top: top - 70,
        behavior: "smooth",
      });
    },
    [refs.current, accomplishments]
  );

  useEffect(() => {
    if (hash !== "") executeScroll(hash);
  }, [hash, executeScroll]);

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
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.accomplishments.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.accomplishments.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {Object.keys(accomplishmentsGroupBy).map((el, index) => {
              const accomplishments = accomplishmentsGroupBy[el];
              const myaccomplishmentsMode = accomplishments.filter((el) =>
                myaccomplishments.includes(el.id)
              );
              const percent =
                accomplishments.length > 0
                  ? (myaccomplishmentsMode.length / accomplishments.length) *
                    100
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
                  {accomplishments.map((accomplishment) => (
                    <Grid
                      item
                      xs={12}
                      key={accomplishment.id}
                      ref={refs.current[accomplishment.id]}
                    >
                      <CardAccomplishment
                        accomplishment={accomplishment}
                        stat={stat}
                        isFinish={myaccomplishments.includes(accomplishment.id)}
                        badge
                        title
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
      </Grid>
    </Grid>
  );
}
