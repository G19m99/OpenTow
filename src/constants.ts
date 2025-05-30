export type RolesType = "admin" | "dispatcher" | "driver";
export const roles: RolesType[] = ["admin", "dispatcher", "driver"];

export const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  open: { label: "Open", variant: "outline" },
  assigned: { label: "Assigned", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export const priorityLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  low: { label: "Low", variant: "outline" },
  normal: { label: "Normal", variant: "secondary" },
  high: { label: "High", variant: "destructive" },
};

export type StatusType =
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";
