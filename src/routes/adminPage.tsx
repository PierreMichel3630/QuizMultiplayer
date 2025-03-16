import AdminEditPage from "src/pages/admin/Edit/AdminEditPage";
import AdminGamesPage from "src/pages/admin/AdminGamesPage";
import AdminProposePage from "src/pages/admin/AdminProposePage";
import AdminQuestionPage from "src/pages/admin/AdminQuestionPage";
import AdminReportPage from "src/pages/admin/AdminReportPage";
import AdminThemesPage from "src/pages/admin/AdminThemesPage";
import AdminEditCategoryPage from "src/pages/admin/Edit/AdminEditCategoryPage";
import AdminEditQuestionsPage from "src/pages/admin/Edit/AdminEditQuestionsPage";
import AdminEditShopPage from "src/pages/admin/Edit/AdminEditShopPage";
import AdminEditThemePage from "src/pages/admin/Edit/AdminEditThemePage";

export const AdminRoutes = [
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
    path: "propose",
    element: <AdminProposePage />,
  },
  {
    path: "edit",
    element: <AdminEditPage />,
    children: [
      {
        path: "theme",
        element: <AdminEditThemePage />,
      },
      {
        path: "questions",
        element: <AdminEditQuestionsPage />,
      },
      {
        path: "categories",
        element: <AdminEditCategoryPage />,
      },
      {
        path: "shop",
        element: <AdminEditShopPage />,
      },
    ],
  },
];
