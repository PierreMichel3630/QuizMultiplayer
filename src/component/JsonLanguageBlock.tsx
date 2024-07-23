import { Typography, TypographyProps } from "@mui/material";
import { useUser } from "src/context/UserProvider";
import { JsonLanguage, JsonLanguageArrayOrString } from "src/models/Language";

interface Props extends TypographyProps {
  value: JsonLanguage;
}
export const JsonLanguageBlock = ({ value, ...props }: Props) => {
  const { language } = useUser();
  const label = value[language.iso] ? value[language.iso] : value["fr-FR"];
  const split = label.toString().split("\n");
  return split.map((el, index) => (
    <Typography {...props} key={index}>
      {el}
    </Typography>
  ));
};

interface PropsArray extends TypographyProps {
  value: Array<JsonLanguage>;
}
export const JsonLanguageArrayBlock = ({ value, ...props }: PropsArray) => {
  const { language } = useUser();
  return (
    <Typography {...props}>
      {value
        .map((el) => {
          const label = el[language.iso] ? el[language.iso] : el["fr-FR"];
          return label;
        })
        .join(", ")}
    </Typography>
  );
};

interface PropsArrayOrString extends TypographyProps {
  value: JsonLanguageArrayOrString;
  all?: boolean;
}
export const JsonLanguageArrayOrStringBlock = ({
  value,
  all = false,
  ...props
}: PropsArrayOrString) => {
  const { language } = useUser();
  const valueLanguage = value[language.iso]
    ? value[language.iso]
    : value["fr-FR"];

  const label = Array.isArray(valueLanguage)
    ? all
      ? valueLanguage.join(", ")
      : valueLanguage[0] ?? ""
    : valueLanguage;
  return <Typography {...props}>{label}</Typography>;
};
