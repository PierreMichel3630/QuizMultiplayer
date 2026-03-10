import { Outlet } from "react-router-dom";
import { ListProvider } from "src/context/ListProvider";

export default function ListOutletPage() {
  return (
    <ListProvider>
      <Outlet />
    </ListProvider>
  );
}
