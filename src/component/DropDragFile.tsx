import {
  Box,
  Grid,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { style } from "typestyle";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: px(300),
});
interface Props {
  file: null | File | string;
  onDrop: (file: File | null) => void;
}
export const DropDragFile = ({ file, onDrop }: Props) => {
  const { t } = useTranslation();

  const filterFiles = useCallback(
    (acceptedFiles: Array<File>) => {
      const newFile = acceptedFiles[0];
      onDrop(newFile);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: filterFiles,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const urlFile = useMemo(
    () =>
      typeof file === "string" || file === null
        ? file
        : URL.createObjectURL(file),
    [file]
  );

  const nameFile = useMemo(
    () => (typeof file === "string" || file === null ? file : file.name),
    [file]
  );

  return (
    <Grid container spacing={1}>
      {urlFile !== null && (
        <Grid item xs={12}>
          <ImageListItem>
            <img className={imageCss} alt="preview" src={urlFile} />
            <ImageListItemBar
              title={nameFile}
              actionIcon={
                <IconButton onClick={() => onDrop(null)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            border: "1px dashed grey",
            cursor: "pointer",
            textAlign: "center",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon fontSize="large" />
          <Typography variant="body1">
            {isDragActive
              ? t("input.dragdrop.drophere")
              : t("input.dragdrop.text")}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
