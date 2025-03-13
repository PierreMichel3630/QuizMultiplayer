import AdminGamesPage from "src/pages/admin/AdminGamesPage";
import AdminImagesPage from "src/pages/admin/AdminImagesPage";
import AdminProposePage from "src/pages/admin/AdminProposePage";
import AdminQuestionPage from "src/pages/admin/AdminQuestionPage";
import AdminQuestionsPage from "src/pages/admin/AdminQuestionsPage";
import AdminReportPage from "src/pages/admin/AdminReportPage";
import AdminThemesPage from "src/pages/admin/AdminThemesPage";

export const AdminRoutes = [
  {
    path: "question",
    element: <AdminQuestionsPage />,
  },
  {
    path: "question/:id",
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
  {
    path: "games",
    element: <AdminGamesPage />,
  },
  {
    path: "images",
    element: <AdminImagesPage />,
  },
  {
    path: "propose",
    element: <AdminProposePage />,
  },
];
