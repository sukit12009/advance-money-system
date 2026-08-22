import { Outlet } from "react-router-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { ApiLoadingOverlay } from "./components/common/ApiLoadingOverlay";
import { AppLayout } from "./components/layout/AppLayout";

export function App() {
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const isApiWorking = fetchingCount > 0 || mutatingCount > 0;
  return (
    <AppLayout>
      <ApiLoadingOverlay open={isApiWorking} />
      <Outlet />
    </AppLayout>
  );
}
