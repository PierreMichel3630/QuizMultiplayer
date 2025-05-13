import ShareIcon from "@mui/icons-material/Share";
import { Box, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { urlPc } from "src/pages/help/InstallationPage";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "./Button";
import { ShareModal } from "./modal/ShareModal";

interface Props {
  title: string;
}
export const ShareApplicationBlock = ({ title }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <ButtonColor
        typography="h6"
        iconSize={20}
        value={Colors.colorApp}
        label={title}
        icon={ShareIcon}
        variant="contained"
        onClick={() => setOpen(true)}
      />
      <ShareModal open={open} close={() => setOpen(false)} />
    </Box>
  );
};

interface PropsScore {
  score: number;
  theme: Theme;
}

export const ShareScoreIcon = ({ score, theme }: PropsScore) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const themeText = useMemo(() => {
    const themeLanguage = theme.name[language.iso];
    const themeFR = theme.name["fr-FR"];
    return themeLanguage ?? themeFR;
  }, [language, theme]);

  const data = useMemo(
    () => ({
      title: t("share.title"),
      text: t("share.score", { score, theme: themeText }),
      url: urlPc,
    }),
    [t, score, themeText]
  );

  const canBrowserShareData = useMemo(() => {
    if (!navigator.share || !navigator.canShare) {
      return false;
    }

    return navigator.canShare(data);
  }, [data]);

  const shareApplication = async () => {
    try {
      await navigator.share(data);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  };

  return (
    canBrowserShareData && (
      <IconButton aria-label="delete" onClick={shareApplication}>
        <ShareIcon fontSize="inherit" />
      </IconButton>
    )
  );
};
