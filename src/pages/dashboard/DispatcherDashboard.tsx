import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { CallCard } from "@/components/calls/CallCard";
import type { CallData } from "@/components/calls/CallCard";

export function DispatcherDashboard() {
  const allCalls = useQuery(api.features.calls.queries.allCalls);
  const stats = useQuery(api.features.calls.queries.dashboardStats);

  const openCalls =
    allCalls?.filter((c) => c.status === "open") ?? [];
  const urgentCalls =
    allCalls?.filter(
      (c) => c.priority !== "normal" && c.status === "open"
    ) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dispatch Center</h1>
          <p className="text-muted-foreground">Manage incoming calls</p>
        </div>
        <Button asChild>
          <Link to="/dispatch">
            <Phone className="mr-2 h-4 w-4" />
            New Call
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-status-open">
              {stats?.openCalls ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-status-en-route">
              {stats?.activeCalls ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-chart-2">
              {stats?.driversOnShift ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">On Shift</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Calls */}
      {urgentCalls.length > 0 && (
        <Card className="border-status-emergency/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-status-emergency">
              <AlertTriangle className="h-5 w-5" />
              Urgent Calls ({urgentCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentCalls.slice(0, 3).map((call) => (
              <CallCard
                key={call._id}
                call={call as unknown as CallData}
                compact
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Open Calls */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Open Calls</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/calls">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {openCalls.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              No open calls
            </p>
          ) : (
            openCalls
              .slice(0, 5)
              .map((call) => (
                <CallCard
                  key={call._id}
                  call={call as unknown as CallData}
                  compact
                />
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
