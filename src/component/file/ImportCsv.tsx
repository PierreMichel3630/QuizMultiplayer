import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { important } from "csx";
import { Colors } from "src/style/Colors";
import { ChangeEvent, createRef } from "react";

interface Props {
  getFile: (file: File) => void;
}
export const UploadButton = ({ getFile }: Props) => {
  const { t } = useTranslation();
  const fileInputRef = createRef<HTMLInputElement>();

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
      getFile(event.target.files[0]);
    }
  };

  return (
    <Button
      startIcon={<AttachFileIcon />}
      variant="contained"
      sx={{
        backgroundColor: important(Colors.grey),
        padding: "3px 5px",
        color: Colors.white,
        border: `2px solid ${Colors.grey}`,
        "&:hover": {
          opacity: 0.85,
        },
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <Typography>{t("proposequestion.excel.uploadfile")}</Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={fileChange}
      />
    </Button>
  );
};
