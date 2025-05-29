import SignOutWithGoogle from "@/auth/oauth/SignOutWithGoogle";
import { Menu } from "lucide-react";

const Navbar = () => {
  const title = "My Application"; // TODO: get title
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => {}} className="hidden md:block">
            <Menu className="h-6 w-6 text-gray-700 hover:text-gray-900" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SignOutWithGoogle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
