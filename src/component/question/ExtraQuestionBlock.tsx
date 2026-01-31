import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { QuestionTranslation } from "src/models/Question";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  questiontranslation: Array<QuestionTranslation>;
}

export const ExtraQuestionBlock = ({ questiontranslation }: Props) => {
  const { language } = useUser();

  const translation = useMemo(() => {
    const trad = [...questiontranslation].find(
      (el) => el.language.id === language?.id,
    );
    return trad;
  }, [questiontranslation, language]);

  return (
    translation?.extra && (
      <Box>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <Typography variant="body1" component="p" fontSize={15}>
                {children}
              </Typography>
            ),
            strong: ({ children }) => (
              <Typography component="span" fontWeight="bold" fontSize={15}>
                {children}
              </Typography>
            ),
            em: ({ children }) => (
              <Typography component="span" fontStyle="italic" fontSize={15}>
                {children}
              </Typography>
            ),
            br: () => <br />,
          }}
        >
          {translation?.extra}
        </ReactMarkdown>
      </Box>
    )
  );
};
