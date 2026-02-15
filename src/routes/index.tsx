import Layout from "@/layout";
import CreateTenantForm from "@/pages/createTenant/CreateTenantForm";
import Dashboard from "@/pages/dashboard/Dashboard";
import { SignInForm } from "@/pages/login/SignInForm";
import OrgPicker from "@/pages/orgPicker/OrgPicker";
import UserManagement from "@/pages/usersManagment/UserManagement";
import Dispatch from "@/pages/dispatch/Dispatch";
import CallsList from "@/pages/calls/CallsList";
import CallDetail from "@/pages/calls/CallDetail";
import AvailableCalls from "@/pages/available/AvailableCalls";
import MyCalls from "@/pages/myCalls/MyCalls";
import Drivers from "@/pages/drivers/Drivers";
import Impounds from "@/pages/impounds/Impounds";
import SettingsPage from "@/pages/settings/Settings";
import Profile from "@/pages/profile/Profile";
import { Navigate, Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route path="login" element={<SignInForm />} />
    <Route path="create-tenant" element={<CreateTenantForm />} />
    <Route path="org-picker" element={<OrgPicker />} />
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dispatch" element={<Dispatch />} />
      <Route path="/calls" element={<CallsList />} />
      <Route path="/calls/:id" element={<CallDetail />} />
      <Route path="/available" element={<AvailableCalls />} />
      <Route path="/my-calls" element={<MyCalls />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/impounds" element={<Impounds />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
