import { Grid } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { GroupButtonClassement } from "src/component/button/ButtonGroup";
import { RankingAccomplishment } from "src/component/ranking/RankingAccomplishment";
import { RankingChallengeGlobal } from "src/component/ranking/RankingChallenge";
import { useAppBar } from "src/context/AppBarProvider";
import {
  AccomplishmentEnum,
  ClassementTypeEnum,
} from "src/models/enum/ClassementEnum";

export default function RankingPage() {
  const { t } = useTranslation();
  const { top, appBarVisible } = useAppBar();
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(
    searchParams.has("sort")
      ? (searchParams.get("sort") as ClassementTypeEnum)
      : ClassementTypeEnum.solo,
  );

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
        sx={{
          position: "sticky",
          top: appBarVisible ? top : 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          transition: "top 350ms ease-in-out",
          backgroundColor: "background.paper",
          p: 1,
          display: "flex",
          gap: 1,
          flexDirection: "column",
        }}
        size={12}
      >
        <GroupButtonClassement
          selected={type}
          onChange={(value) => {
            setType(value);
          }}
        />
      </Grid>
      <Grid sx={{ p: 1 }} size={12}>
        {
          {
            [ClassementTypeEnum.solo]: (
              <RankingAccomplishment
                defaultSort={AccomplishmentEnum.points}
                sorts={[
                  AccomplishmentEnum.points,
                  AccomplishmentEnum.games,
                  AccomplishmentEnum.gameshundredpts,
                  AccomplishmentEnum.gamesfiftypts,
                  AccomplishmentEnum.gamestwentypts,
                  AccomplishmentEnum.gamestenpts,
                  AccomplishmentEnum.themetenpts,
                  AccomplishmentEnum.themetwentypts,
                ]}
              />
            ),
            [ClassementTypeEnum.duel]: (
              <RankingAccomplishment
                defaultSort={AccomplishmentEnum.rank}
                sorts={[
                  AccomplishmentEnum.rank,
                  AccomplishmentEnum.duelgames,
                  AccomplishmentEnum.victoryduel,
                  AccomplishmentEnum.drawduel,
                  AccomplishmentEnum.defeatduel,
                ]}
              />
            ),
            [ClassementTypeEnum.challenge]: <RankingChallengeGlobal />,
            [ClassementTypeEnum.others]: (
              <RankingAccomplishment
                defaultSort={AccomplishmentEnum.xp}
                sorts={[
                  AccomplishmentEnum.xp,
                  AccomplishmentEnum.streak,
                  AccomplishmentEnum.money,
                ]}
              />
            ),
          }[type]
        }
      </Grid>
    </Grid>
  );
}
