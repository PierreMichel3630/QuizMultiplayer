import { Typography, TypographyProps } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";

interface TextLabel {
  label: string;
  language: Language;
}

interface PropsTextLabel extends TypographyProps {
  values: Array<TextLabel>;
  languageParameter?: Language;
  noTranslation?: boolean;
}

export const TextLabelBlock = ({
  values,
  languageParameter,
  noTranslation = false,
  ...typographyProps
}: PropsTextLabel) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const languageText = useMemo(
    () => languageParameter ?? language,
    [languageParameter, language]
  );

  const label = useMemo(() => {
    const translations = [...values];
    if (languageText && translations.length > 0) {
      const trad = translations.find(
        (el) => el.language.id === languageText?.id
      );
      const labelTranslation = trad ? trad.label : translations[0].label;
      const labelNoTranslation = trad ? trad.label : undefined;
      return noTranslation ? labelNoTranslation : labelTranslation;
    }
    return undefined;
  }, [values, languageText, noTranslation]);

  return (
    <Typography
      {...typographyProps}
      variant={label ? typographyProps.variant : "caption"}
    >
      {label ?? t("commun.totranslation")}
    </Typography>
  );
};

interface TextName {
  name: string;
  language: number | Language;
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
    const translations = values ? [...values] : [];
    if (language && translations.length > 0) {
      const trad = translations.find((el) => typeof(el.language) === "number" ? el.language === language?.id :  el.language.id === language?.id);
      return trad ? trad.name : translations[0].name;
    }
    return "";
  }, [language, values]);

  return <Typography {...typographyProps}>{name}</Typography>;
};
