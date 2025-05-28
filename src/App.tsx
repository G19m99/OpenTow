import { SignInWithGoogle } from "@/auth/oauth/SignInWithGoogle";
import { Authenticated, Unauthenticated } from "convex/react";
import SignOutWithGoogle from "./auth/oauth/SignOutWithGoogle";

function App() {
  return (
    <div className="bg-blue-500">
      <Unauthenticated>
        App <SignInWithGoogle />
      </Unauthenticated>
      <Authenticated>
        Hello authenticated user!
        <SignOutWithGoogle />
      </Authenticated>
    </div>
  );
}

export default App;
