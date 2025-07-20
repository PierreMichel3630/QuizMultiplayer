import { Dialog, DialogContent, Grid } from "@mui/material";
import { ChallengeGameForm } from "src/form/admin/ChallengeGameForm";
import { ChallengeGame } from "src/models/Challenge";

interface Props {
  game?: ChallengeGame;
  open: boolean;
  close: () => void;
}

export const EditChallengeGameModal = ({ game, open, close }: Props) => {
  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ChallengeGameForm game={game} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
