import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Box, Button, ButtonProps, SvgIcon, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { important, percent, px } from "csx";
import { ElementType } from "react";
import { Colors } from "src/style/Colors";
interface Props extends ButtonProps {
  value: string;
  label: string;
  icon?: ElementType;
  typography?: Variant | "inherit";
  variant?: "text" | "outlined" | "contained";
}
export const ButtonColor = ({
  icon,
  value,
  label,
  typography = "h4",
  variant = "outlined",
  ...props
}: Props) => {
  const style =
    variant && variant === "outlined"
      ? {
          minWidth: "auto",
          color: value,
          borderColor: value,
          borderWidth: 2,
          backgroundColor: Colors.blue3,
          "&:hover": {
            backgroundColor: value,
            color: Colors.blue3,
            border: "2px solid currentColor",
          },
        }
      : {
          minWidth: "auto",
          backgroundColor: value,
          color: Colors.white,
          border: `2px solid ${value}`,
          "&:hover": {
            backgroundColor: Colors.white,
            color: value,
          },
        };

  return icon ? (
    <Button
      variant={variant}
      fullWidth
      sx={style}
      {...props}
      startIcon={
        <SvgIcon
          component={icon}
          inheritViewBox
          sx={{ fontSize: important(px(25)) }}
        />
      }
    >
      <Typography variant={typography} noWrap>
        {label}
      </Typography>
    </Button>
  ) : (
    <Button variant={variant} fullWidth sx={style} {...props}>
      <Typography variant={typography} noWrap>
        {label}
      </Typography>
    </Button>
  );
};

interface PropsSelect extends Props {
  select: boolean;
}
export const ButtonColorSelect = ({
  icon,
  value,
  label,
  select = false,
  typography = "h4",
  variant = "outlined",
  ...props
}: PropsSelect) => {
  return (
    <Box sx={{ position: "relative" }}>
      {select && (
        <CheckCircleTwoToneIcon
          sx={{
            color: Colors.green2,
            position: "absolute",
            backgroundColor: "white",
            borderRadius: percent(50),
            top: 0,
            right: 0,
            zIndex: 1,
            transform: "translate(30%, -30%)",
          }}
        />
      )}
      <ButtonColor
        value={value}
        label={label}
        icon={icon}
        variant={variant}
        typography={typography}
        {...props}
      />
    </Box>
  );
};
