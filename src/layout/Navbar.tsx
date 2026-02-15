import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RolesType } from "@/constants";
import { api } from "@c/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Truck, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type HeaderProps = {
  roles: RolesType[];
};

const roleColors: Record<RolesType, string> = {
  admin: "bg-chart-1 text-primary-foreground",
  dispatcher: "bg-chart-2 text-primary-foreground",
  driver: "bg-chart-3 text-primary-foreground",
};

const Header = ({ roles }: HeaderProps) => {
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.features.users.queries.getCurrentUser);
  const toggleShift = useMutation(api.features.drivers.mutations.toggleShift);

  const isDriver = roles.includes("driver");
  const primaryRole = roles.includes("admin")
    ? "admin"
    : roles.includes("dispatcher")
      ? "dispatcher"
      : "driver";

  const name = currentUser?.name ?? "";
  const email = currentUser?.email ?? "";
  const isOnShift = currentUser?.isOnShift ?? false;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">OpenTow</span>
            <Badge
              variant="outline"
              className={cn(
                "mt-1 h-4 text-[10px] px-1.5",
                roleColors[primaryRole]
              )}
            >
              {primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDriver && (
            <Button
              variant={isOnShift ? "default" : "outline"}
              size="sm"
              onClick={() => toggleShift({})}
              className={cn(
                "h-8 text-xs",
                isOnShift && "bg-status-open hover:bg-status-open/90"
              )}
            >
              {isOnShift ? "On Shift" : "Off Shift"}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => void signOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
