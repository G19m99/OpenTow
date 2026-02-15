import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";

export default function Drivers() {
  const drivers = useQuery(
    api.features.drivers.queries.getAllDriversWithShiftStatus
  );

  const onShift = drivers?.filter((d) => d.isOnShift) ?? [];
  const offShift = drivers?.filter((d) => !d.isOnShift) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Drivers</h1>
        <p className="text-sm text-muted-foreground">
          {onShift.length} on shift &bull; {offShift.length} off shift
        </p>
      </div>

      {/* On Shift */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="h-2 w-2 rounded-full bg-status-open animate-pulse" />
            On Shift ({onShift.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {onShift.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No drivers currently on shift
            </p>
          ) : (
            <div className="space-y-3">
              {onShift.map((driver) => (
                <DriverRow key={driver.userId} driver={driver} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Off Shift */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-muted-foreground">
            Off Shift ({offShift.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {offShift.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              All drivers are on shift
            </p>
          ) : (
            <div className="space-y-3 opacity-60">
              {offShift.map((driver) => (
                <DriverRow key={driver.userId} driver={driver} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DriverRow({
  driver,
}: {
  driver: {
    userId: string;
    name: string;
    email: string;
    isOnShift: boolean;
    activeCallCount: number;
  };
}) {
  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{driver.name}</p>
        <p className="text-xs text-muted-foreground truncate">{driver.email}</p>
      </div>
      {driver.activeCallCount > 0 && (
        <Badge variant="outline" className="bg-status-en-route/20 text-status-en-route border-status-en-route/30">
          <Truck className="mr-1 h-3 w-3" />
          {driver.activeCallCount}
        </Badge>
      )}
    </div>
  );
}
