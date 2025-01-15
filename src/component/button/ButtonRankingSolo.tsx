import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { Fragment, useMemo, useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { padding, px } from "csx";
import { useTranslation } from "react-i18next";
import { ClassementSoloModeEnum } from "src/models/enum/ClassementEnum";
import { Colors } from "src/style/Colors";

interface Props {
  value: ClassementSoloModeEnum;
  onChange: (value: ClassementSoloModeEnum) => void;
}
export const ButtonRankingSolo = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [openDate, setOpenDate] = useState(false);
  const optionsDate = useMemo(
    () => [
      {
        label: t("commun.alltime"),
        value: ClassementSoloModeEnum.alltime,
      },
      {
        label: t("commun.month"),
        value: ClassementSoloModeEnum.month,
      },
      {
        label: t("commun.week"),
        value: ClassementSoloModeEnum.week,
      },
    ],
    [t]
  );

  const [openOther, setOpenOther] = useState(false);
  const optionsOther = useMemo(
    () => [
      {
        label: t("ranking.finishtheme"),
        value: ClassementSoloModeEnum.finishtheme,
      },
      {
        label: t("ranking.gameshundredpts"),
        value: ClassementSoloModeEnum.gameshundredpts,
      },
      {
        label: t("ranking.gamesfiftypts"),
        value: ClassementSoloModeEnum.gamesfiftypts,
      },
      {
        label: t("ranking.gamestwentypts"),
        value: ClassementSoloModeEnum.gamestwentypts,
      },
      {
        label: t("ranking.gamestenpts"),
        value: ClassementSoloModeEnum.gamestenpts,
      },
    ],
    [t]
  );

  const handleClose = () => {
    setOpenDate(false);
    setOpenOther(false);
  };

  const select = (value: ClassementSoloModeEnum) => {
    handleClose();
    onChange(value);
  };

  const isSelectDate = useMemo(
    () => optionsDate.find((el) => el.value === value),
    [value, optionsDate]
  );

  const isSelectOther = useMemo(
    () => optionsOther.find((el) => el.value === value),
    [value, optionsOther]
  );

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            border: `1px solid ${Colors.grey6}`,
            p: padding(3, 3),
            borderRadius: px(50),
          }}
        >
          <Box
            sx={{
              borderRadius: px(50),
              p: padding(2, 12),
              color: isSelectDate ? Colors.white : "text.primary",
              backgroundColor: isSelectDate ? Colors.blue : "initial",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: px(3),
            }}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              setAnchorEl(event.currentTarget);
              setOpenDate(true);
            }}
          >
            <Typography variant="h6">{t("commun.perdate")}</Typography>
            <ArrowDropDownIcon />
          </Box>
          <Box
            sx={{
              borderRadius: px(50),
              p: padding(2, 12),
              color: isSelectOther ? Colors.white : "text.primary",
              backgroundColor: isSelectOther ? Colors.blue : "initial",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: px(3),
            }}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              setAnchorEl(event.currentTarget);
              setOpenOther(true);
            }}
          >
            <Typography variant="h6">{t("commun.other")}</Typography>
            <ArrowDropDownIcon />
          </Box>
        </Box>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openDate}
        onClose={handleClose}
      >
        {optionsDate.map((option, index) => (
          <MenuItem
            key={index}
            selected={option.value === value}
            onClick={() => select(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openOther}
        onClose={handleClose}
      >
        {optionsOther.map((option, index) => (
          <MenuItem
            key={index}
            selected={option.value === value}
            onClick={() => select(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
