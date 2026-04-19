import { TablePagination } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  total: null | number;
  page: number;
  rowsPerPage?: number;
  handleChangePage: (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
}
export const Pagination = ({
  total,
  page,
  handleChangePage,
  rowsPerPage = 10,
}: Props) => {
  const { t } = useTranslation();

  return (
    total !== null &&
    total > rowsPerPage &&  (
      <TablePagination
        component="div"
        size="small"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} ${t("commun.to")} ${count}`
        }
        labelRowsPerPage=""
        showFirstButton
        showLastButton
        rowsPerPageOptions={[]}
      />
    )
  );
};
