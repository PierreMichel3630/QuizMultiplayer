import { Avatar, AvatarGroup } from "@mui/material";
import { useMemo, useState } from "react";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { QuestionLanguageModal } from "./LanguageModal";
import { QuestionCount } from "src/models/Question";

interface PropsAvatarLanguageGroup {
  languages: Array<Language>;
  questionsCount: Array<QuestionCount>;
}

export const AvatarLanguageGroup = ({
  languages,
  questionsCount,
}: PropsAvatarLanguageGroup) => {
  const { mode } = useUser();

  const [open, setOpen] = useState(false);
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  return (
    <>
      <AvatarGroup
        total={languages.length}
        max={4}
        sx={{
          "& .MuiAvatar-root": {
            width: 25,
            height: 25,
            fontSize: 15,
            border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
          },
        }}
        onClick={() => setOpen(true)}
      >
        {languages.map((el) => (
          <Avatar key={el.id} alt="flag" src={el.icon} />
        ))}
      </AvatarGroup>
      <QuestionLanguageModal
        open={open}
        onClose={() => setOpen(false)}
        values={questionsCount}
      />
    </>
  );
};
