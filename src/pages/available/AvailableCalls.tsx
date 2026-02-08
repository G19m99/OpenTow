import { useQuery, useMutation } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CallCard } from "@/components/calls/CallCard";
import type { CallData } from "@/components/calls/CallCard";
import { Radio, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AvailableCalls() {
  const currentUser = useQuery(api.features.users.queries.getCurrentUser);
  const openCalls = useQuery(api.features.calls.queries.openCalls);
  const claimCall = useMutation(api.features.calls.mutations.claimCall);
  const toggleShift = useMutation(api.features.drivers.mutations.toggleShift);

  const isOnShift = currentUser?.isOnShift ?? false;

  // Sort: emergency > urgent > normal
  const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
  const sortedCalls = [...(openCalls ?? [])].sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Available Calls</h1>
          <p className="text-sm text-muted-foreground">
            {sortedCalls.length} calls waiting
          </p>
        </div>
        {isOnShift && (
          <div className="flex items-center gap-2 text-status-open">
            <Radio className={cn("h-4 w-4 animate-pulse")} />
            <span className="text-sm font-medium">Listening</span>
          </div>
        )}
      </div>

      {/* Shift check */}
      {!isOnShift && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Truck className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">You're Off Shift</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Go on shift to accept tow calls
            </p>
            <Button onClick={() => toggleShift({})}>Go On Shift</Button>
          </CardContent>
        </Card>
      )}

      {/* Calls */}
      {isOnShift && (
        <div className="space-y-4">
          {sortedCalls.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Radio className="mx-auto mb-4 h-8 w-8 text-muted-foreground animate-pulse" />
                <p className="text-muted-foreground">
                  No calls available right now
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  New calls will appear here automatically
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedCalls.map((call) => (
              <CallCard
                key={call._id}
                call={call as unknown as CallData}
                showActions
                onAccept={() => claimCall({ callId: call._id })}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
