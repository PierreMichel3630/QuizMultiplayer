import { Box, Typography } from "@mui/material";
import { border, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAuth } from "src/context/AuthProviderSupabase";
import { BadgeLevel } from "src/icons/BadgeLevel";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Colors } from "src/style/Colors";
import { getLevel } from "src/utils/calcul";
import { style } from "typestyle";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { MoneyBlock } from "./MoneyBlock";
import { BadgeAccountSkeleton } from "./skeleton/SkeletonAccount";

const divCss = style({
  display: "flex",
  borderRadius: 30,
  marginTop: px(5),
  marginBottom: px(5),
  border: border({ width: 2, style: "solid", color: Colors.grey }),
  padding: "1px 5px",
  alignItems: "center",
  cursor: "pointer",
  $nest: {
    "&:hover": {
      backgroundColor: Colors.grey,
    },
  },
});

interface Props {
  onClick: (event: any) => void;
}
export const AccountBadge = ({ onClick }: Props) => {
  const { profile } = useAuth();

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [profile]);

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

  return profile ? (
    <div onClick={onClick} className={divCss}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: px(2),
          ml: px(3),
          mr: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: px(2), alignItems: "center" }}>
          <Typography variant="h4" color="text.secondary">
            {profile.username}
          </Typography>
          {level && <BadgeLevel level={level} size={25} fontSize={12} />}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <MoneyBlock money={profile.money} variant="body1" />
        </Box>
      </Box>
      <AvatarAccount avatar={profile.avatar.icon} size={45} />
    </div>
  ) : (
    <div className={divCss}>
      <BadgeAccountSkeleton />
    </div>
  );
};
