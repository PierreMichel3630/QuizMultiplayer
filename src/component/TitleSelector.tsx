import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { percent, viewHeight } from "csx";
import { Link } from "react-router-dom";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";
import { BadgeTitle } from "./Badge";

interface Props {
  onSelect: (value: Title) => void;
}

export const TitleSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { titles, mytitles } = useApp();

  const titlesUnlock = useMemo(() => {
    const idUnlock = mytitles.map((el) => el.id);
    return [...titles]
      .map((badge) => ({
        ...badge,
        unlock: idUnlock.includes(badge.id),
      }))
      .sort(sortByUnlock);
  }, [titles, mytitles]);

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={{ maxHeight: viewHeight(20), overflowX: "scroll" }}
    >
      {titlesUnlock.map((title) => {
        const isSelect =
          profile && profile.title && profile.title.id === title.id;

        return (
          <Grid item key={title.id}>
            <Box sx={{ position: "relative" }}>
              {title.unlock ? (
                <>
                  {isSelect && (
                    <CheckCircleTwoToneIcon
                      sx={{
                        color: Colors.green2,
                        position: "absolute",
                        backgroundColor: "white",
                        borderRadius: percent(50),
                        top: 0,
                        right: 0,
                        transform: "translate(50%, -50%)",
                        zIndex: 2,
                      }}
                    />
                  )}
                  <BadgeTitle
                    label={title.name}
                    onClick={() => onSelect(title)}
                  />
                </>
              ) : (
                <Link
                  to={`/title/${title.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <BadgeTitle label={title.name} color={Colors.grey4} />
                  <Box
                    sx={{
                      position: "absolute",
                      top: percent(50),
                      left: percent(50),
                      transform: "translate(-10%, -40%)",
                    }}
                  >
                    <LockTwoToneIcon
                      sx={{
                        fontSize: 25,
                        color: Colors.black,
                      }}
                    />
                  </Box>
                </Link>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};
