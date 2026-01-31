import { Outlet } from "react-router-dom";
import { AppBarBlock } from "src/component/appbar/AppBarBlock";

export default function AppBarOutletPage() {
  return (
    <>
      <AppBarBlock />
      <Outlet />
    </>
  );
}
