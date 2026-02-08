import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { SERVICE_TYPE_LABELS } from "@/constants";
import type { CallStatusType, CallPriorityType, ServiceType } from "@/constants";
import {
  MapPin,
  Car,
  Phone,
  Clock,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { Id } from "@c/_generated/dataModel";

export interface CallData {
  _id: Id<"calls">;
  callNumber: string;
  status: CallStatusType;
  priority: CallPriorityType;
  callerName: string;
  callerPhone: string;
  pickupAddress: string;
  pickupNotes?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear?: string;
  vehicleColor?: string;
  serviceType: ServiceType;
  createdAt: number;
}

interface CallCardProps {
  call: CallData;
  showActions?: boolean;
  onAccept?: () => void;
  compact?: boolean;
}

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

export function CallCard({
  call,
  showActions = false,
  onAccept,
  compact = false,
}: CallCardProps) {
  if (compact) {
    return (
      <Link to={`/calls/${call._id}`}>
        <Card className="transition-colors hover:bg-accent/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">
                  {call.callNumber}
                </span>
                <StatusBadge status={call.status} />
                {call.priority !== "normal" && (
                  <PriorityBadge priority={call.priority} />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {call.pickupAddress}
              </p>
              <p className="text-xs text-muted-foreground">
                {call.vehicleYear} {call.vehicleMake} {call.vehicleModel}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card
      className={cn(
        call.priority === "emergency" && "border-status-emergency/50"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">
                {call.callNumber}
              </span>
              <StatusBadge status={call.status} />
            </div>
            {call.priority !== "normal" && (
              <PriorityBadge priority={call.priority} />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeAgo(call.createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm font-medium text-foreground">
          {SERVICE_TYPE_LABELS[call.serviceType]}
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">{call.pickupAddress}</p>
            {call.pickupNotes && (
              <p className="text-xs text-muted-foreground">
                {call.pickupNotes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span>
            {call.vehicleColor && `${call.vehicleColor} `}
            {call.vehicleYear} {call.vehicleMake} {call.vehicleModel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>
            {call.callerName} &bull; {call.callerPhone}
          </span>
        </div>

        {showActions && call.status === "open" && (
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={onAccept}>
              Accept Call
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(call.pickupAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {!showActions && (
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              asChild
            >
              <Link to={`/calls/${call._id}`}>
                View Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
