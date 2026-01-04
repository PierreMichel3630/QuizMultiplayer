import {
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Challenge } from "src/models/Challenge";
import { CardSignalQuestion } from "../card/CardQuestion";
import { Fragment } from "react";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  challenge: Challenge | null;
  open: boolean;
  close: () => void;
}

export const SeeChallengeModal = ({ challenge, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        {challenge != null && (
          <Grid container spacing={1} justifyContent="center">
            {challenge.questionsv2.map((question, index) => (
              <Fragment key={index}>
                <Typography variant="h2">
                  <Trans
                    i18nKey={t("commun.questionid")}
                    values={{
                      id: index + 1,
                    }}
                  />
                </Typography>
                <Grid item xs={12}>
                  <CardSignalQuestion question={question} />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ borderBottomWidth: 5 }} />
                </Grid>
              </Fragment>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
