import { ClipboardList, LayoutGrid, Truck, Users } from "lucide-react";

const useNavItems = (userRoles: ("admin" | "dispatcher" | "driver")[]) => {
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

  return { navItems };
};

export default useNavItems;
