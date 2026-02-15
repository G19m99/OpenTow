import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Phone,
  ClipboardList,
  Radio,
  Users,
  Settings,
  Warehouse,
} from "lucide-react";

type MobileNavbarProps = {
  userRoles: ("admin" | "dispatcher" | "driver")[];
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function getNavItems(roles: string[]): NavItem[] {
  const isAdmin = roles.includes("admin");
  const isDispatcher = roles.includes("dispatcher");
  const isDriver = roles.includes("driver");

  // Use highest role for nav selection
  if (isAdmin) {
    return [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dispatch", label: "Dispatch", icon: Phone },
      { href: "/calls", label: "Calls", icon: ClipboardList },
      { href: "/impounds", label: "Impounds", icon: Warehouse },
      { href: "/users", label: "Users", icon: Users },
      { href: "/settings", label: "Settings", icon: Settings },
    ];
  }

  if (isDispatcher) {
    return [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dispatch", label: "Dispatch", icon: Phone },
      { href: "/calls", label: "Calls", icon: ClipboardList },
      { href: "/impounds", label: "Impounds", icon: Warehouse },
    ];
  }

  if (isDriver) {
    return [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/available", label: "Available", icon: Radio },
      { href: "/my-calls", label: "My Calls", icon: ClipboardList },
      { href: "/profile", label: "Profile", icon: Settings },
    ];
  }

  return [];
}

const MobileNavbar = ({ userRoles }: MobileNavbarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const navItems = getNavItems(userRoles);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-primary")}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
