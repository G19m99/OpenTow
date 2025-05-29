import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

const SignOutWithGoogle = () => {
  const { signOut } = useAuthActions();
  return (
    <Button variant="ghost" size="icon" onClick={() => void signOut()}>
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Log out</span>
    </Button>
  );
};

export default SignOutWithGoogle;
