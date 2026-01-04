import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RoundButton } from "./button/RoundButton";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { Profile } from "src/models/Profile";
import { FriendProfilButton } from "./FriendButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  profileUser?: Profile;
}
export const ProfileAction = ({ profileUser }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const options = [
    {
      title: t("commun.compare"),
      icon: <CompareArrowsIcon />,
      onClick: () => compare(),
    },
  ];
  
  const compare = () => {
    if (profile) {
      navigate(`/compare`, {
        state: { profile1: profile, profile2: profileUser },
      });
    } else {
      navigate(`/login`);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "self-start" }}>
      {options.map((option, index) => (
        <RoundButton
          key={index}
          title={option.title}
          icon={option.icon}
          onClick={option.onClick}
        />
      ))}
      {profileUser && <FriendProfilButton profile={profileUser} />}
    </Box>
  );
};
