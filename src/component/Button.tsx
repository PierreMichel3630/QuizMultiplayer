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
  fullWidth?: boolean;
  iconSize?: number;
  typography?: Variant | "inherit";
  variant?: "text" | "outlined" | "contained";
  noWrap?: boolean;
}
export const ButtonColor = ({
  icon,
  value,
  label,
  fullWidth = true,
  typography = "h4",
  variant = "outlined",
  iconSize = 25,
  noWrap = false,
  ...props
}: Props) => {
  const style =
    variant && variant === "outlined"
      ? {
          minWidth: "auto",
          color: value,
          borderColor: value,
          borderWidth: 2,
          padding: "3px 5px",
          backgroundColor: Colors.colorApp,
          "&:hover": {
            opacity: 0.85,
          },
        }
      : {
          minWidth: "auto",
          backgroundColor: important(value),
          padding: "3px 5px",
          color: Colors.white,
          border: `2px solid ${value}`,
          "&:hover": {
            opacity: 0.85,
          },
        };

  return icon ? (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      {...props}
      sx={{ ...style, ...props.sx }}
      startIcon={
        <SvgIcon
          component={icon}
          inheritViewBox
          sx={{ fontSize: important(px(iconSize)) }}
        />
      }
    >
      <Typography variant={typography} noWrap={noWrap}>
        {label}
      </Typography>
    </Button>
  ) : (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      {...props}
      sx={{ ...style, ...props.sx }}
    >
      <Typography variant={typography} noWrap={noWrap}>
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
