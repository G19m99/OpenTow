import { cn } from "@/lib/utils";
import { ClipboardList, LayoutGrid, Truck, Users } from "lucide-react";
import { Link, useLocation } from "react-router";

type MobileNavbarProps = {
  userRoles: ("admin" | "dispatcher" | "driver")[];
};
const MobileNavbar = ({ userRoles }: MobileNavbarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const isAdmin = userRoles.includes("admin");
  const isDispatcher = userRoles.includes("dispatcher");
  const isDriver = userRoles.includes("driver");
  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutGrid,
      show: isDispatcher || isAdmin,
    },
    {
      title: "Open Calls",
      href: "/open-jobs",
      icon: ClipboardList,
      show: isDriver || isDispatcher || isAdmin,
    },
    {
      title: "My Jobs",
      href: "/my-jobs",
      icon: Truck,
      show: isDriver || isDispatcher || isAdmin,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      show: isAdmin,
    },
  ].filter((item) => item.show);

  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t bg-white md:hidden">
      <div className="mx-auto flex h-full items-center justify-around px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "hover:bg-muted inline-flex flex-col items-center justify-center px-1 transition-colors",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="mb-1 h-6 w-6" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
