import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusType } from "@/constants";
import { statusLabels, priorityLabels } from "@/constants";

const statusStyles: Record<StatusType, string> = {
  open: "bg-status-open/20 text-status-open border-status-open/30",
  assigned:
    "bg-status-assigned/20 text-status-assigned border-status-assigned/30",
  in_progress:
    "bg-status-en-route/20 text-status-en-route border-status-en-route/30",
  completed:
    "bg-status-completed/20 text-status-completed border-status-completed/30",
  cancelled:
    "bg-status-cancelled/20 text-status-cancelled border-status-cancelled/30",
};

const priorityStyles: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  normal: "bg-muted text-muted-foreground",
  high: "bg-status-urgent/20 text-status-urgent border-status-urgent/30",
};

export function StatusBadge({ status }: { status: StatusType }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status])}
    >
      {statusLabels[status].label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", priorityStyles[priority])}
    >
      {priorityLabels[priority].label}
    </Badge>
  );
}
