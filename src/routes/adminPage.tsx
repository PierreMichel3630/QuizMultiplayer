import { AdminQuestionPage } from "src/pages/admin/AdminQuestionPage";
import { AdminReportPage } from "src/pages/admin/AdminReportPage";
import { AdminThemesPage } from "src/pages/admin/AdminThemesPage";

export const AdminRoutes = [
  {
    path: "question",
    element: <AdminQuestionPage />,
  },
  {
    path: "report",
    element: <AdminReportPage />,
  },
  {
    path: "themes",
    element: <AdminThemesPage />,
  },
];
