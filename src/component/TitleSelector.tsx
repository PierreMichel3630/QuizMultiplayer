import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { MoneyBlock } from "./MoneyBlock";

interface Props {
  onSelect: (value: Title) => void;
}

export const TitleSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { titles, mytitles } = useApp();
  const { t } = useTranslation();

  const titlesVerify = useMemo(() => {
    const idUnlock = mytitles.map((el) => el.id);
    return [...titles]
      .map((title) => ({
        ...title,
        unlock:
          title.isaccomplishment || title.price > 0
            ? idUnlock.includes(title.id)
            : true,
      }))
      .sort(sortByUnlock);
  }, [titles, mytitles]);

  const titlesUnlock = useMemo(
    () => [...titlesVerify].filter((el) => el.unlock),
    [titlesVerify]
  );

  const titlesLock = useMemo(
    () => [...titlesVerify].filter((el) => !el.unlock),
    [titlesVerify]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          {titlesUnlock.map((title) => {
            const isSelect =
              profile && profile.title && profile.title.id === title.id;

            return (
              <Grid item xs={12} sm={6} key={title.id}>
                <Box sx={{ position: "relative", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      p: px(3),
                      backgroundColor: Colors.blue3,
                      borderRadius: px(5),
                    }}
                    onClick={() => onSelect(title)}
                  >
                    <JsonLanguageBlock
                      variant="h6"
                      color="text.secondary"
                      value={title.name}
                    />
                    {isSelect && (
                      <CheckCircleTwoToneIcon
                        sx={{
                          color: Colors.green2,
                          backgroundColor: "white",
                          borderRadius: percent(50),
                          zIndex: 2,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          {titlesLock.map((title) => {
            return (
              <Grid item xs={12} sm={6} key={title.id}>
                <Box sx={{ position: "relative", textAlign: "center" }}>
                  <Link
                    to={`/title/${title.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: Colors.grey4,
                        borderRadius: px(5),
                      }}
                    >
                      <JsonLanguageBlock
                        variant="h6"
                        color="text.secondary"
                        value={title.name}
                      />

                      {title.price > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MoneyBlock money={title.price} variant="h6" />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LockTwoToneIcon
                            sx={{
                              fontSize: 20,
                              color: Colors.black,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {t("commun.unlockaccomplishments")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Link>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
