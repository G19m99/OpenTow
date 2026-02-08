import { useQuery, useMutation } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const roleColors: Record<string, string> = {
  admin: "bg-chart-1 text-primary-foreground",
  dispatcher: "bg-chart-2 text-primary-foreground",
  driver: "bg-chart-3 text-primary-foreground",
};

export default function Profile() {
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.features.users.queries.getCurrentUser);
  const currentUserRoles = useQuery(
    api.features.users.queries.getCurrentUserRoles
  );
  const myCalls = useQuery(api.features.calls.queries.usersCalls);
  const toggleShift = useMutation(api.features.drivers.mutations.toggleShift);

  const name = currentUser?.name ?? "";
  const email = currentUser?.email ?? "";
  const isOnShift = currentUser?.isOnShift ?? false;
  const isDriver = currentUserRoles?.includes("driver") ?? false;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const primaryRole = currentUserRoles?.includes("admin")
    ? "admin"
    : currentUserRoles?.includes("dispatcher")
      ? "dispatcher"
      : "driver";

  // Monthly stats for drivers
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const completedThisMonth =
    myCalls?.filter(
      (c) =>
        c.status === "completed" &&
        c.completedAt &&
        c.completedAt >= monthStart
    ).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 text-center">
          <Avatar className="mx-auto mb-4 h-20 w-20">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground mb-3">{email}</p>
          <Badge
            variant="outline"
            className={cn("text-sm", roleColors[primaryRole])}
          >
            {primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}
          </Badge>
          {isDriver && (
            <Badge
              variant="outline"
              className={cn(
                "ml-2 text-sm",
                isOnShift
                  ? "bg-status-open/20 text-status-open border-status-open/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isOnShift ? "On Shift" : "Off Shift"}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Shift Toggle (drivers) */}
      {isDriver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="h-5 w-5" />
              Shift Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant={isOnShift ? "default" : "outline"}
              className={cn(
                "w-full",
                isOnShift && "bg-status-open hover:bg-status-open/90"
              )}
              onClick={() => toggleShift({})}
            >
              {isOnShift ? "Go Off Shift" : "Go On Shift"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Monthly Stats (drivers) */}
      {isDriver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Completed Calls
              </span>
              <span className="text-2xl font-bold text-status-completed">
                {completedThisMonth}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign Out */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => void signOut()}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
