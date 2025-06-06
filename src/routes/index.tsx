import Layout from "@/layout";
import CreateTenantForm from "@/pages/createTenant/CreateTenantForm";
import Dashboard from "@/pages/dashboard/Dashboard";
import { SignInForm } from "@/pages/login/SignInForm";
import MyJobs from "@/pages/myJobs/MyJobs";
import OpenJobs from "@/pages/OpenJobs/OpenJobs";
import UserManagement from "@/pages/usersManagment/UserManagement";
import { Navigate, Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route path="login" element={<SignInForm />} />
    <Route path="create-tenant" element={<CreateTenantForm />} />
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/open-jobs" element={<OpenJobs />} />
      <Route path="/my-jobs" element={<MyJobs />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
