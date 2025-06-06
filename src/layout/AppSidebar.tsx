import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useNavItems from "@/hooks/useNavItems";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";

type AppSidebarProps = {
  userRoles: ("admin" | "dispatcher" | "driver")[];
};

const AppSidebar = ({ userRoles }: AppSidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { navItems } = useNavItems(userRoles);
  return (
    <Sidebar side="left" variant="sidebar" className="top-16">
      <SidebarHeader>
        <div className="flex items-center flex-shrink-0 px-4 py-2">
          <span className="font-bold text-xl">Open Tow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link to={item.href} className={cn("flex items-center gap-3")}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
