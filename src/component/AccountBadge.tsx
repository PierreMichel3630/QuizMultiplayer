import { Typography } from "@mui/material";
import { border } from "csx";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { BadgeAccountActive } from "./Badge";
import { BadgeAccountSkeleton } from "./skeleton/SkeletonAccount";

const divCss = style({
  display: "flex",
  borderRadius: 30,
  border: border({ width: 1, style: "solid", color: Colors.grey3 }),
  padding: 5,
  alignItems: "center",
  cursor: "pointer",
  $nest: {
    "&:hover": {
      backgroundColor: Colors.lightgrey,
    },
  },
});

interface Props {
  onClick: (event: any) => void;
}
export const AccountBadge = ({ onClick }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  return profile ? (
    <div onClick={onClick} className={divCss}>
      <Typography
        component="small"
        variant="caption"
        color="secondary"
        ml={1}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        {t("header.account.hi")}
      </Typography>
      <Typography
        component="small"
        variant="caption"
        sx={{ display: { xs: "none", md: "flex" }, fontWeight: 700 }}
        ml={0.5}
        mr={1}
        color="secondary"
      >
        {profile.username}
      </Typography>
      <BadgeAccountActive
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        overlap="circular"
        variant="dot"
      >
        <AvatarAccount avatar={profile.avatar} />
      </BadgeAccountActive>
    </div>
  ) : (
    <div className={divCss}>
      <BadgeAccountSkeleton />
    </div>
  );
};
