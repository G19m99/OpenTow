import SignOutWithGoogle from "@/auth/oauth/SignOutWithGoogle";
import Layout from "@/layout";
import { SignInForm } from "@/pages/login/SignInForm";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route path="login" element={<SignInForm />} />
    <Route element={<Layout />}>
      <Route
        path="/"
        element={
          <div>
            Welcome to the authenticated area! <SignOutWithGoogle />
          </div>
        }
      />
    </Route>
  </Routes>
);

export default AppRoutes;
