import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useState } from "react";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ConfirmDialog } from "../modal/ConfirmModal";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

export const DeleteAccountButton = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const { deleteAccount } = useAuth();

  return (
    <>
      <ButtonColor
        value={Colors.red}
        label={t("commun.deleteaccount")}
        icon={RemoveCircleIcon}
        variant="contained"
        onClick={() => setOpenModal(true)}
      />
      <ConfirmDialog
        title={t("commun.deleteaccount")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={deleteAccount}
        text={t("commun.deleteaccountmessage")}
      />
    </>
  );
};
