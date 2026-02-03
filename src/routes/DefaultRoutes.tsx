import ForgotPasswordPage from "src/pages/connect/ForgotPasswordPage";
import LoginPage from "src/pages/connect/LoginPage";
import RegisterPage from "src/pages/connect/RegisterPage";
import PlayPage from "src/pages/PlayPage";
import SearchMobilePage from "src/pages/SearchMobilePage";

export const DefaultRoutes = [
  // Connection
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // Autres
  {
    path: "/play",
    element: <PlayPage />,
  },
  {
    path: "/searchmobile",
    element: <SearchMobilePage />,
  },
];
