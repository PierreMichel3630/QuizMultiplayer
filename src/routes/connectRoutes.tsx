import ForgotPasswordPage from "src/pages/connect/ForgotPasswordPage";
import LoginPage from "src/pages/connect/LoginPage";
import RegisterPage from "src/pages/connect/RegisterPage";

export const ConnectRoutes = [
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
];
