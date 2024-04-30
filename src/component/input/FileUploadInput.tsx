import { FormControl, FormHelperText } from "@mui/material";
import { DropDragFile } from "../DropDragFile";

interface Props {
  formik: any;
  field: string;
}

export const FileUploadInput = ({ formik, field }: Props) => (
  <FormControl
    fullWidth
    error={Boolean(formik.touched[field] && formik.errors[field])}
  >
    <DropDragFile
      file={formik.values[field]}
      onDrop={(file) => formik.setFieldValue(field, file)}
    />
    <FormHelperText error id={`error-${field}`}>
      {formik.errors[field]}
    </FormHelperText>
  </FormControl>
);
