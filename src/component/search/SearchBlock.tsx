import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { BasicSearchInput } from "../Input";

import { useIsMobileOrTablet } from "src/hook/useSize";
import { BadgeButtonRedirection } from "../button/BadgeButton";

interface Props {
  search: string;
  onChange?: (value: string) => void;
  onFocus: () => void;
}

export const SearchBlock = ({ search, onChange, onFocus }: Props) => {
  const { t } = useTranslation();
  const isMobileOrTablet = useIsMobileOrTablet();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {isMobileOrTablet && (
        <Box sx={{ display: "flex" }}>
          <BasicSearchInput
            label={t("commun.search")}
            onChange={onChange}
            onFocus={onFocus}
            value={search}
          />
        </Box>
      )}
      <Box>
        <BadgeButtonRedirection />
      </Box>
    </Box>
  );
};
