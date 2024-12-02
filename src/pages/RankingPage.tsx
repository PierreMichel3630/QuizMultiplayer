import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { selectStatAccomplishment } from "src/api/accomplishment";
import { selectScore } from "src/api/score";
import { GroupButtonClassement } from "src/component/button/ButtonGroup";
import { DataRanking, RankingTable } from "src/component/table/RankingTable";
import { useApp } from "src/context/AppProvider";
import { BadgeLevel } from "src/icons/BadgeLevel";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Score } from "src/models/Score";
import { ClassementEnum } from "src/models/enum/ClassementEnum";
import { getLevel } from "src/utils/calcul";

export default function RankingPage() {
  const { t } = useTranslation();
  const { headerSize } = useApp();
  const [searchParams] = useSearchParams();

  const ITEMPERPAGE = 25;

  const [type, setType] = useState(
    searchParams.has("sort")
      ? (searchParams.get("sort") as ClassementEnum)
      : ClassementEnum.points
  );

  const [data, setData] = useState<Array<DataRanking>>([]);

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (type === ClassementEnum.points || type === ClassementEnum.rank) {
      selectScore(type, page, ITEMPERPAGE).then(({ data }) => {
        const res = data as Array<Score>;
        const newdata = res.map((el, index) => {
          const champ = el[type];
          return {
            profile: el.profile,
            value: Array.isArray(champ) ? champ.length : champ,
            theme: el.theme,
            rank: page * ITEMPERPAGE + index + 1,
          };
        });
        setIsEnd(newdata.length < ITEMPERPAGE);
        setData((prev) => [...prev, ...newdata]);
        setIsLoading(false);
      });
    } else {
      selectStatAccomplishment(type, page, ITEMPERPAGE).then(({ data }) => {
        const res = data as Array<StatAccomplishment>;
        const newdata = res.map((el, index) => {
          const champ =
            type === ClassementEnum.xp ? (
              <BadgeLevel level={getLevel(el[type])} size={35} fontSize={15} />
            ) : (
              el[type]
            );
          return {
            profile: el.profile,
            value: Array.isArray(champ) ? champ.length : champ,
            rank: page * ITEMPERPAGE + index + 1,
          };
        });
        setIsEnd(newdata.length < ITEMPERPAGE);
        setData((prev) => [...prev, ...newdata]);
        setIsLoading(false);
      });
    }
  }, [page, type]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 500 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (!isEnd && !isLoading) setPage((prev) => prev + 1);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd, isLoading]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.people.title")} - ${t("appname")}`}</title>
      </Helmet>
      <meta
        name="description"
        content="Comparez vos scores aux autres joueurs et voyez qui a le plus de connaissances"
      />
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: headerSize,
          backgroundColor: "background.paper",
          p: 1,
          zIndex: 10,
        }}
      >
        <GroupButtonClassement
          selected={type}
          onChange={(value) => {
            setPage(0);
            setIsLoading(true);
            setData([]);
            setType(value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RankingTable data={data} loading={isLoading} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
