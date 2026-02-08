import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Phone, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const stats = useQuery(api.features.calls.queries.dashboardStats);
  const users = useQuery(api.features.users.queries.getUsers);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your towing operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-open/20">
                <Phone className="h-5 w-5 text-status-open" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.openCalls ?? 0}</p>
                <p className="text-xs text-muted-foreground">Open Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-en-route/20">
                <Clock className="h-5 w-5 text-status-en-route" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.activeCalls ?? 0}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-completed/20">
                <CheckCircle className="h-5 w-5 text-status-completed" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.completedToday ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20">
                <Truck className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.driversOnShift ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drivers On Shift
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button asChild>
            <Link to="/dispatch">New Dispatch</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/calls">View All Calls</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/users">Manage Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/settings">Settings</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Users Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="font-medium">{users?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admins</span>
              <span className="font-medium">
                {users?.filter((u) => u.roles.includes("admin")).length ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dispatchers</span>
              <span className="font-medium">
                {users?.filter((u) => u.roles.includes("dispatcher")).length ??
                  0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Drivers</span>
              <span className="font-medium">
                {users?.filter((u) => u.roles.includes("driver")).length ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
