import { Toaster } from "@/components/ui/sonner";
import React from "react";
import AppRoutes from "./routes";

function App() {
  return (
    <React.Fragment>
      <Toaster />
      <AppRoutes />
    </React.Fragment>
  );
}

export default App;
