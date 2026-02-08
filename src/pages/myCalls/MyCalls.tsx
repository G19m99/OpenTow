import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallCard } from "@/components/calls/CallCard";
import type { CallData } from "@/components/calls/CallCard";
import { InCallControls } from "@/components/calls/InCallControls";
import { Clock } from "lucide-react";
import { useState } from "react";
import type { CallStatusType } from "@/constants";

export default function MyCalls() {
  const myCalls = useQuery(api.features.calls.queries.usersCalls);
  const [tab, setTab] = useState<"active" | "completed">("active");

  const activeCalls =
    myCalls?.filter(
      (c) => !["completed", "cancelled"].includes(c.status)
    ) ?? [];

  const completedCalls =
    myCalls?.filter(
      (c) => c.status === "completed" || c.status === "cancelled"
    ) ?? [];

  const currentCall = activeCalls[0];
  const otherActive = activeCalls.slice(1);

  const displayCalls = tab === "active" ? activeCalls : completedCalls;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Calls</h1>
        <p className="text-sm text-muted-foreground">
          {activeCalls.length} active &bull; {completedCalls.length} completed
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "active" | "completed")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Active ({activeCalls.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed ({completedCalls.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "active" && currentCall && (
        <>
          {/* Current active call with controls */}
          <Card className="border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Current Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CallCard call={currentCall as unknown as CallData} />
              <InCallControls
                call={{
                  _id: currentCall._id,
                  status: currentCall.status as CallStatusType,
                  pickupAddress: currentCall.pickupAddress,
                  callerPhone: currentCall.callerPhone,
                }}
              />
            </CardContent>
          </Card>

          {/* Other active calls */}
          {otherActive.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Other Active</h2>
              {otherActive.map((call) => (
                <CallCard
                  key={call._id}
                  call={call as unknown as CallData}
                  compact
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "active" && activeCalls.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No active calls</p>
          </CardContent>
        </Card>
      )}

      {tab === "completed" && (
        <div className="space-y-3">
          {displayCalls.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No completed calls yet</p>
              </CardContent>
            </Card>
          ) : (
            displayCalls.map((call) => (
              <CallCard
                key={call._id}
                call={call as unknown as CallData}
                compact
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
