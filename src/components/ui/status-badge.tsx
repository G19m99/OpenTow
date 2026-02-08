import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  CallStatusType,
  CallPriorityType,
  ImpoundStatusType,
} from "@/constants";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  IMPOUND_STATUS_LABELS,
} from "@/constants";

const statusStyles: Record<CallStatusType, string> = {
  open: "bg-status-open/20 text-status-open border-status-open/30",
  assigned:
    "bg-status-assigned/20 text-status-assigned border-status-assigned/30",
  en_route:
    "bg-status-en-route/20 text-status-en-route border-status-en-route/30",
  on_scene:
    "bg-status-on-scene/20 text-status-on-scene border-status-on-scene/30",
  hooked: "bg-status-en-route/20 text-status-en-route border-status-en-route/30",
  in_transit:
    "bg-status-assigned/20 text-status-assigned border-status-assigned/30",
  completed:
    "bg-status-completed/20 text-status-completed border-status-completed/30",
  cancelled:
    "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
};

const priorityStyles: Record<CallPriorityType, string> = {
  normal: "bg-muted text-muted-foreground",
  urgent: "bg-status-urgent/20 text-status-urgent border-status-urgent/30",
  emergency:
    "bg-status-emergency/20 text-status-emergency border-status-emergency/30 animate-pulse",
};

const impoundStatusStyles: Record<ImpoundStatusType, string> = {
  active: "bg-status-open/20 text-status-open border-status-open/30",
  pending_release:
    "bg-status-urgent/20 text-status-urgent border-status-urgent/30",
  released:
    "bg-status-completed/20 text-status-completed border-status-completed/30",
  auctioned:
    "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
  junked:
    "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
};

export function StatusBadge({ status }: { status: CallStatusType }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: CallPriorityType }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", priorityStyles[priority])}
    >
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

export function ImpoundStatusBadge({
  status,
}: {
  status: ImpoundStatusType;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", impoundStatusStyles[status])}
    >
      {IMPOUND_STATUS_LABELS[status]}
    </Badge>
  );
}
