import { Avatar, Box, Typography } from "@mui/material";
import { Colors } from "src/style/Colors";
import { LoadingDot } from "../Loading";
import { useTranslation } from "react-i18next";

export const SearchPlayerBlock = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <LoadingDot color={Colors.white} width={40} />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          textShadow: "1px 1px 2px black",
        }}
      >
        {t("commun.searchinprogress")}
      </Typography>
    </Box>
  );
};

export const SearchPlayerBlock2 = () => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: "20px 0",
        maxWidth: "700px",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <Avatars />
      <Avatars />
    </Box>
  );
};

export const Avatars = () => {
  const avatars = [
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-9.png",
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-23.png",
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-19.png",
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-22.png",
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-30.png",
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-39.png",
    "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/avatar/avatar-31.png",
  ];
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        paddingRight: 1,
        willChange: "transform",
        animation: "scrolling 5s linear infinite",
      }}
    >
      {avatars.map((avatar, index) => (
        <Avatar key={index} src={avatar} sx={{ width: 80, height: 80 }} />
      ))}
    </Box>
  );
};
