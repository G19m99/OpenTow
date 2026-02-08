import {
  ClipboardList,
  LayoutDashboard,
  Phone,
  Radio,
  Settings,
  Users,
  Warehouse,
} from "lucide-react";

const useNavItems = (userRoles: ("admin" | "dispatcher" | "driver")[]) => {
  const isAdmin = userRoles.includes("admin");
  const isDispatcher = userRoles.includes("dispatcher");
  const isDriver = userRoles.includes("driver");

  if (isAdmin) {
    return {
      navItems: [
        { title: "Dashboard", href: "/", icon: LayoutDashboard },
        { title: "Dispatch", href: "/dispatch", icon: Phone },
        { title: "Calls", href: "/calls", icon: ClipboardList },
        { title: "Impounds", href: "/impounds", icon: Warehouse },
        { title: "Users", href: "/users", icon: Users },
        { title: "Settings", href: "/settings", icon: Settings },
      ],
    };
  }

  if (isDispatcher) {
    return {
      navItems: [
        { title: "Dashboard", href: "/", icon: LayoutDashboard },
        { title: "Dispatch", href: "/dispatch", icon: Phone },
        { title: "Calls", href: "/calls", icon: ClipboardList },
        { title: "Impounds", href: "/impounds", icon: Warehouse },
      ],
    };
  }

  if (isDriver) {
    return {
      navItems: [
        { title: "Dashboard", href: "/", icon: LayoutDashboard },
        { title: "Available", href: "/available", icon: Radio },
        { title: "My Calls", href: "/my-calls", icon: ClipboardList },
        { title: "Profile", href: "/profile", icon: Settings },
      ],
    };
  }

  return { navItems: [] };
};

export default useNavItems;
