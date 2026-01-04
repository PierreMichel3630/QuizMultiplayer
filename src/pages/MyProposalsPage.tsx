import CategoryIcon from "@mui/icons-material/Category";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectQuestionsProposeBy } from "src/api/question";
import { selectThemesProposeBy } from "src/api/theme";
import { NoResultAlert } from "src/component/alert/NoResultAlert";
import { CardProposeQuestion } from "src/component/card/CardQuestion";
import { CardProposeTheme } from "src/component/card/CardTheme";
import { SkeletonProposeQuestions } from "src/component/skeleton/SkeletonQuestion";
import { SkeletonRectangulars } from "src/component/skeleton/SkeletonRectangular";
import { DefaultTabs } from "src/component/Tabs";
import { useAuth } from "src/context/AuthProviderSupabase";
import { QuestionAdmin } from "src/models/Question";
import { Theme } from "src/models/Theme";

export default function MyProposalsPage() {
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);

  const tabs = useMemo(
    () => [
      { icon: <QuestionMarkIcon />, label: t("commun.questions"), width: 150 },
      { icon: <CategoryIcon />, label: t("commun.themes") },
    ],
    [t]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <DefaultTabs
                values={tabs}
                tab={tab}
                onChange={(value) => {
                  setTab(value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {tab === 0 ? <ProposalQuestionBlock /> : <ProposalThemeBlock />}
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

const ProposalQuestionBlock = () => {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getQuestions = () => {
      if (profile) {
        setIsLoading(true);
        selectQuestionsProposeBy(profile.id).then(({ data }) => {
          setQuestions(data ?? []);
          setIsLoading(false);
        });
      }
    };
    getQuestions();
  }, [profile]);

  return (
    <Grid container spacing={1}>
      {isLoading ? (
        <SkeletonProposeQuestions number={3} />
      ) : (
        <>
          {questions.length > 0 ? (
            questions.map((question) => (
              <Grid item xs={12} key={question.id}>
                <CardProposeQuestion question={question} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <NoResultAlert />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

const ProposalThemeBlock = () => {
  const { profile } = useAuth();
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getQuestions = () => {
      if (profile) {
        setIsLoading(true);
        selectThemesProposeBy(profile.id).then(({ data }) => {
          setThemes(data ?? []);
          setIsLoading(false);
        });
      }
    };
    getQuestions();
  }, [profile]);

  return (
    <Grid container spacing={1}>
      {isLoading ? (
        <SkeletonRectangulars number={4} height={100} />
      ) : (
        <>
          {themes.length > 0 ? (
            themes.map((theme) => (
              <Grid item xs={12} key={theme.id}>
                <CardProposeTheme theme={theme} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <NoResultAlert />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
