import { useQuery, useMutation } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Truck, Clock } from "lucide-react";
import { Link } from "react-router";
import { CallCard } from "@/components/calls/CallCard";
import type { CallData } from "@/components/calls/CallCard";

export function DriverDashboard() {
  const currentUser = useQuery(api.features.users.queries.getCurrentUser);
  const openCalls = useQuery(api.features.calls.queries.openCalls);
  const myCalls = useQuery(api.features.calls.queries.usersCalls);
  const claimCall = useMutation(api.features.calls.mutations.claimCall);
  const toggleShift = useMutation(api.features.drivers.mutations.toggleShift);

  const isOnShift = currentUser?.isOnShift ?? false;

  const activeCall = myCalls?.find(
    (c) => !["completed", "cancelled"].includes(c.status)
  );

  const completedToday =
    myCalls?.filter((c) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (
        c.status === "completed" &&
        c.completedAt &&
        c.completedAt >= today.getTime()
      );
    }).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground">
          {isOnShift ? "You're on shift" : "You're off shift"}
        </p>
      </div>

      {/* Shift Toggle */}
      {!isOnShift && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Truck className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">Start Your Shift</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Go on shift to start receiving tow calls
            </p>
            <Button onClick={() => toggleShift({})}>Go On Shift</Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {isOnShift && (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-status-open">
                {openCalls?.length ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-status-en-route">
                {activeCall ? 1 : 0}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-status-completed">
                {completedToday}
              </p>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Call */}
      {activeCall && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Current Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CallCard call={activeCall as unknown as CallData} />
          </CardContent>
        </Card>
      )}

      {/* Available Calls */}
      {isOnShift && !activeCall && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Radio className="h-5 w-5 text-status-open" />
                Available Calls
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/available">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!openCalls || openCalls.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No calls available right now
              </p>
            ) : (
              openCalls.slice(0, 3).map((call) => (
                <CallCard
                  key={call._id}
                  call={call as unknown as CallData}
                  showActions
                  onAccept={() => claimCall({ callId: call._id })}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
