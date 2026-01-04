import { FormControl, FormHelperText } from "@mui/material";
import { DropDragFile } from "../DropDragFile";

interface Props {
  formik: any;
  field: string;
  maxWidth: number;
  maxSize: number;
}

export const FileUploadInput = ({
  formik,
  field,
  maxWidth,
  maxSize,
}: Props) => (
  <FormControl
    fullWidth
    error={Boolean(formik.touched[field] && formik.errors[field])}
  >
    <DropDragFile
      file={formik.values[field]}
      onDrop={(file) => formik.setFieldValue(field, file)}
      maxSize={maxSize}
      maxWidth={maxWidth}
    />
    <FormHelperText error id={`error-${field}`}>
      {formik.errors[field]}
    </FormHelperText>
  </FormControl>
);
