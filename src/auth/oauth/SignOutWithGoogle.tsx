import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const SignOutWithGoogle = () => {
  const { signOut } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signOut()}
    >
      Sign out
    </Button>
  );
};

export default SignOutWithGoogle;
