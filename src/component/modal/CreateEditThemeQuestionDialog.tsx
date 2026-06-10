import {
  Dialog,
  DialogContent,
  Grid
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteQuestionTheme,
  insertQuestionTheme,
  selectQuestionThemeByQuestion,
} from "src/api/question";
import { QuestionAdmin } from "src/models/Question";
import { Theme } from "src/models/Theme";
import { AutocompleteInputTheme } from "../Autocomplete";
import { ICardImage } from "../card/CardImage";
import { ChipThemeEdit } from "../chip/ChipTheme";
import { TitleModal } from "./commun/TitleModal";

interface Props {
  open: boolean;
  question: QuestionAdmin;
  close: () => void;
}

export const CreateEditThemeQuestionDialog = ({
  question,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();

  const [themes, setThemes] = useState<Array<Theme>>(
    [...question.questiontheme].map((el) => el.theme),
  );

  const refresh = () => {
    selectQuestionThemeByQuestion(question.id).then(({ data }) => {
      const res = data ?? [];
      setThemes([...res].map((el) => el.theme));
    });
  };

  const onDelete = (theme: Theme) => {
    deleteQuestionTheme(question.id, theme.id).then(() => {
      refresh();
    });
  };

  const onInsert = (theme: ICardImage) => {
    insertQuestionTheme({
      question: question.id,
      theme: Number(theme.id),
    }).then(() => {
      refresh();
    });
  };

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "50vh" },
      }}
    >
      <TitleModal title={t("commun.editthethemes")} close={close} />
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <AutocompleteInputTheme
              placeholder={t("commun.selecttheme")}
              onSelect={(newvalue) => onInsert(newvalue)}
            />
          </Grid>
          {themes.map((theme) => (
            <Grid key={theme.id}>
              <ChipThemeEdit theme={theme} onDelete={() => onDelete(theme)} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
