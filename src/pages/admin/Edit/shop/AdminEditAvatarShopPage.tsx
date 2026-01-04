import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";

import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { selectAvatar } from "src/api/avatar";
import { CardAdminAvatar } from "src/component/card/CardAdmin";
import { CreateEditAvatarDialog } from "src/component/modal/CreateEditAvatarDialog";
import { SkeletonCardTheme } from "src/component/skeleton/SkeletonTheme";
import { Avatar } from "src/models/Avatar";
import { Colors } from "src/style/Colors";

export default function AdminEditAvatarShopPage() {
  const { t } = useTranslation();

  const [avatars, setAvatars] = useState<Array<Avatar>>([]);
  const [avatar, setAvatar] = useState<Avatar | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAvatars();
  }, []);

  const getAvatars = () => {
    selectAvatar().then(({ data }) => {
      setAvatars(data ?? []);
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <ButtonColor
          icon={AddIcon}
          label={t("commun.addavatar")}
          value={Colors.green}
          onClick={() => setOpenModal(true)}
          variant="contained"
        />
      </Grid>
      {avatars.map((avatar) => (
        <Grid item xs={12} key={avatar.id}>
          <CardAdminAvatar
            avatar={avatar}
            onEdit={() => {
              setAvatar(avatar);
              setOpenModal(true);
            }}
          />
        </Grid>
      ))}
      {isLoading && (
        <>
          {Array.from(new Array(10)).map((_, index) => (
            <Grid item xs={12} key={index}>
              <SkeletonCardTheme />
            </Grid>
          ))}
        </>
      )}
      <CreateEditAvatarDialog
        avatar={avatar}
        open={openModal}
        close={() => {
          setOpenModal(false);
          setAvatar(undefined);
          getAvatars();
        }}
      />
    </Grid>
  );
}
