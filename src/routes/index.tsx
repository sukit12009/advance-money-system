import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/App";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { PaymentTypesPage } from "@/pages/PaymentTypesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { UsersPage } from "@/pages/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "payment-types", element: <PaymentTypesPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
