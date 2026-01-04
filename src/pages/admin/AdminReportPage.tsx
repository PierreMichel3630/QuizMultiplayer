import { Alert, Box, Grid, Pagination } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  countReportMessage,
  deleteReportById,
  selectReport,
} from "src/api/report";
import { CardReport } from "src/component/card/CardReport";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { SkeletonCardReport } from "src/component/skeleton/SkeletonReport";
import { useMessage } from "src/context/MessageProvider";
import { Report } from "src/models/Report";

export default function AdminReportPage() {
  const { t } = useTranslation();

  const { setMessage, setSeverity } = useMessage();

  const ITEMPERPAGE = 29;
  const [count, setCount] = useState<null | number>(null);
  const [page, setPage] = useState<number>(1);
  const [reports, setReports] = useState<Array<Report>>([]);
  const [report, setReport] = useState<Report | undefined>(undefined);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPage = useCallback(() => {
    selectReport(page - 1, ITEMPERPAGE).then(({ data }) => {
      setReports(data as Array<Report>);
      setIsLoading(false);
    });
  }, [page]);

  useEffect(() => {
    setIsLoading(true);
    getPage();
  }, [page, ITEMPERPAGE, getPage]);

  const getCount = useCallback(() => {
    countReportMessage().then(({ count }) => {
      setCount(count);
    });
  }, []);

  useEffect(() => {
    getCount();
  }, [getCount]);

  const deleteReport = () => {
    if (report) {
      deleteReportById(report.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setOpenConfirmModal(false);
          setReport(undefined);
          getPage();
        }
      });
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      {isLoading ? (
        <>
          {Array.from(new Array(10)).map((_, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6
              }}>
              <SkeletonCardReport />
            </Grid>
          ))}
        </>
      ) : (
        <>
          {reports.length > 0 ? (
            reports.map((report) => (
              <Grid
                key={report.id}
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <CardReport
                  report={report}
                  onDelete={() => {
                    setReport(report);
                    setOpenConfirmModal(true);
                  }}
                />
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Alert severity="warning">{t("alert.noresult")}</Alert>
            </Grid>
          )}
        </>
      )}
      <Grid sx={{ mb: 5 }} size={12} />
      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          left: 5,
          right: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={count ? Math.ceil(count / ITEMPERPAGE) : 1}
          page={page}
          onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
            setPage(value)
          }
          variant="outlined"
          shape="rounded"
          sx={{
            backgroundColor: "background.paper",
          }}
        />
      </Box>
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteReport}
      />
    </Grid>
  );
}
