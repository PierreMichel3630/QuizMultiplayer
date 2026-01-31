import {
  Box,
  Grid,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { useTranslation } from "react-i18next";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import imageCompression from "browser-image-compression";

interface Props {
  file: null | File | string;
  onDrop: (file: File | null) => void;
  maxSize: number;
  maxWidth: number;
}
export const DropDragFile = ({ file, onDrop, maxSize, maxWidth }: Props) => {
  const { t } = useTranslation();

  const filterFiles = (acceptedFiles: Array<File>) => {
    const newFile = acceptedFiles[0];
    const options = {
      maxSizeMB: maxSize * 0.001,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      maxIteration: 5,
    };

    if (newFile) {
      imageCompression(newFile, options).then((res) => {
        onDrop(res);
      });
    } else {
      onDrop(null);
    }
  };
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
      {urlFile && (
        <Grid size={12}>
          <ImageListItem>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img alt="preview" src={urlFile} />
            </Box>
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
      <Grid size={12}>
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
