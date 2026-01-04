import { Dialog, DialogContent, Grid } from "@mui/material";
import { Moment } from "moment";
import { ChallengeGameForm } from "src/form/admin/ChallengeGameForm";
import { ChallengeGame } from "src/models/Challenge";

interface Props {
  date: Moment;
  game?: ChallengeGame;
  open: boolean;
  close: () => void;
}

export const EditChallengeGameModal = ({ date, game, open, close }: Props) => {
  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ChallengeGameForm date={date} game={game} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
