import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@mui/icons-material/Download";

export const CsvTemplateProposeQuestion = (t: (key: string) => string) => {
  const csvString = [
    [
      t("proposequestion.excel.question"),
      t("proposequestion.excel.reponse"),
      t("proposequestion.excel.wronganswer1"),
      t("proposequestion.excel.wronganswer2"),
      t("proposequestion.excel.wronganswer3"),
    ],
    [
      t("proposequestion.excel.examplequestion"),
      t("proposequestion.excel.examplereponse"),
      t("proposequestion.excel.examplewronganswer1"),
      t("proposequestion.excel.examplewronganswer2"),
      t("proposequestion.excel.examplewronganswer3"),
    ],
  ]
    .map((row) => row.join(";"))
    .join("\n");
  return csvString;
};

export const ExportCsvProposeQuestion = () => {
  const { t } = useTranslation();
  const downloadCSV = () => {
    // Convert the data array into a CSV string
    const csvString = CsvTemplateProposeQuestion(t);

    // Create a Blob from the CSV string
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvString], {
      type: "text/csv;charset=utf-8;",
    });

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "proposequestion.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ButtonColor
      typography="body1"
      value={Colors.grey}
      label={t("commun.download")}
      icon={DownloadIcon}
      variant="contained"
      fullWidth={false}
      onClick={downloadCSV}
      sx={{ width: "min-content" }}
    />
  );
};
