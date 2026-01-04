import { Fragment, useMemo, useState } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { padding, px } from "csx";
import { useTranslation } from "react-i18next";
import { ClassementDuelModeEnum } from "src/models/enum/ClassementEnum";
import { Colors } from "src/style/Colors";

interface Props {
  value: ClassementDuelModeEnum;
  onChange: (value: ClassementDuelModeEnum) => void;
}
export const ButtonRankingDuel = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openOther, setOpenOther] = useState(false);

  const optionsOther = useMemo(
    () => [
      {
        label: t("ranking.duelgames"),
        value: ClassementDuelModeEnum.duelgames,
      },
      {
        label: t("ranking.victoryduel"),
        value: ClassementDuelModeEnum.victoryduel,
      },
      {
        label: t("ranking.drawduel"),
        value: ClassementDuelModeEnum.drawduel,
      },
      {
        label: t("ranking.defeatduel"),
        value: ClassementDuelModeEnum.defeatduel,
      },
    ],
    [t]
  );

  const handleClose = () => {
    setOpenOther(false);
  };

  const select = (value: ClassementDuelModeEnum) => {
    handleClose();
    onChange(value);
  };

  const isSelectOther = useMemo(
    () => optionsOther.find((el) => el.value === value),
    [value, optionsOther]
  );

  const isSelectBestRank = useMemo(
    () => value === ClassementDuelModeEnum.bestrank,
    [value]
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
              color: isSelectBestRank ? Colors.white : "text.primary",
              backgroundColor: isSelectBestRank ? Colors.blue : "initial",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: px(3),
            }}
            onClick={() => {
              onChange(ClassementDuelModeEnum.bestrank);
            }}
          >
            <Typography variant="h6">{t("ranking.bestrank")}</Typography>
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
