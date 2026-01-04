import AdminGamesPage from "src/pages/admin/AdminGamesPage";
import AdminNotificationPage from "src/pages/admin/AdminNotificationPage";
import AdminProposePage from "src/pages/admin/AdminProposePage";
import AdminQuestionPage from "src/pages/admin/AdminQuestionPage";
import AdminReportPage from "src/pages/admin/AdminReportPage";
import AdminEditCategoryPage from "src/pages/admin/Edit/AdminEditCategoryPage";
import AdminEditChallengePage from "src/pages/admin/Edit/AdminEditChallengePage";
import AdminEditPage from "src/pages/admin/Edit/AdminEditPage";
import AdminEditQuestionsPage from "src/pages/admin/Edit/AdminEditQuestionsPage";
import AdminEditShopPage from "src/pages/admin/Edit/AdminEditShopPage";
import AdminEditThemePage from "src/pages/admin/Edit/AdminEditThemePage";

export const AdminRoutes = [
  {
    path: "question/:id",
    element: <AdminQuestionPage />,
  },
  {
    path: "notifications",
    element: <AdminNotificationPage />,
  },
  {
    path: "report",
    element: <AdminReportPage />,
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
    path: "shop",
    element: <AdminEditShopPage />,
  },
  {
    path: "challenge",
    element: <AdminEditChallengePage />,
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
    ],
  },
];
