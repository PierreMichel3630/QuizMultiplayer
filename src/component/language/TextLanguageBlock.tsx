import { Typography, TypographyProps } from "@mui/material";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";

interface TextLabel {
  label: string;
  language: Language;
}

interface PropsTextLabel extends TypographyProps {
  values: Array<TextLabel>;
}

export const TextLabelBlock = ({
  values,
  ...typographyProps
}: PropsTextLabel) => {
  const { language } = useUser();
  const label = useMemo(() => {
    const translations = [...values];
    if (language && translations.length > 0) {
      const trad = translations.find((el) => el.language.id === language?.id);
      return trad ? trad.label : translations[1].label;
    }
    return "";
  }, [language, values]);

  return <Typography {...typographyProps}>{label}</Typography>;
};

interface TextName {
  name: string;
  language: Language;
}

interface PropsTextNameBlock extends TypographyProps {
  values: Array<TextName>;
}

export const TextNameBlock = ({
  values,
  ...typographyProps
}: PropsTextNameBlock) => {
  const { language } = useUser();
  const name = useMemo(() => {
    const translations = [...values];
    if (language && translations.length > 0) {
      const trad = translations.find((el) => el.language.id === language?.id);
      return trad ? trad.name : translations[1].name;
    }
    return "";
  }, [language, values]);

  return <Typography {...typographyProps}>{name}</Typography>;
};
