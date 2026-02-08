import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  PriorityBadge,
} from "@/components/ui/status-badge";
import { InCallControls } from "@/components/calls/InCallControls";
import { SERVICE_TYPE_LABELS, STATUS_LABELS } from "@/constants";
import type { CallStatusType, ServiceType } from "@/constants";
import {
  ArrowLeft,
  MapPin,
  Car,
  Phone,
  Clock,
  Navigation,
  User,
} from "lucide-react";
import type { Id } from "@c/_generated/dataModel";
import LoadingSpinner from "@/components/LoadingSpinner";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const call = useQuery(
    api.features.calls.queries.getCallById,
    id ? { callId: id as Id<"calls"> } : "skip"
  );
  const history = useQuery(
    api.features.calls.queries.getCallHistory,
    id ? { callId: id as Id<"calls"> } : "skip"
  );
  const currentUser = useQuery(api.features.users.queries.getCurrentUser);

  if (call === undefined) {
    return <LoadingSpinner message="Loading call details..." />;
  }

  if (!call) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Call not found</p>
      </div>
    );
  }

  const isAssignedDriver =
    currentUser && call.driverId === currentUser.userId;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold">
              {call.callNumber}
            </span>
            <StatusBadge status={call.status as CallStatusType} />
          </div>
          <p className="text-sm text-muted-foreground">{timeAgo(call.createdAt)}</p>
        </div>
      </div>

      {/* In-Call Controls for assigned driver */}
      {isAssignedDriver && (
        <InCallControls
          call={{
            _id: call._id,
            status: call.status as CallStatusType,
            pickupAddress: call.pickupAddress,
            callerPhone: call.callerPhone,
          }}
        />
      )}

      {/* Service & Priority */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {SERVICE_TYPE_LABELS[call.serviceType as ServiceType]}
            </span>
            <PriorityBadge priority={call.priority as "normal" | "urgent" | "emergency"} />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium">Pickup</p>
            <p className="text-sm text-muted-foreground">
              {call.pickupAddress}
            </p>
            {call.pickupNotes && (
              <p className="text-xs text-muted-foreground">
                {call.pickupNotes}
              </p>
            )}
          </div>
          {call.dropoffAddress && (
            <div>
              <p className="text-sm font-medium">Dropoff</p>
              <p className="text-sm text-muted-foreground">
                {call.dropoffAddress}
              </p>
              {call.dropoffNotes && (
                <p className="text-xs text-muted-foreground">
                  {call.dropoffNotes}
                </p>
              )}
            </div>
          )}
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(call.pickupAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Navigate to Pickup
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Vehicle */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="h-4 w-4" />
            Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm">
            {call.vehicleColor && `${call.vehicleColor} `}
            {call.vehicleYear} {call.vehicleMake} {call.vehicleModel}
          </p>
          {call.vehicleLicensePlate && (
            <p className="text-sm text-muted-foreground">
              Plate: {call.vehicleLicensePlate}
            </p>
          )}
          {call.vehicleCondition && (
            <p className="text-sm text-muted-foreground">
              Condition: {call.vehicleCondition}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Caller */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Caller
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{call.callerName}</p>
            <p className="text-sm text-muted-foreground">{call.callerPhone}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${call.callerPhone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Service Notes */}
      {call.serviceNotes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Service Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{call.serviceNotes}</p>
          </CardContent>
        </Card>
      )}

      {/* Status Timeline */}
      {history && history.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {i < history.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm font-medium">
                      {STATUS_LABELS[entry.status as CallStatusType] ??
                        entry.status}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-muted-foreground">
                        {entry.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
