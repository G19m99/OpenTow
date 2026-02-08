export type RolesType = "admin" | "dispatcher" | "driver";
export const roles: RolesType[] = ["admin", "dispatcher", "driver"];

export type CallStatusType =
  | "open"
  | "assigned"
  | "en_route"
  | "on_scene"
  | "hooked"
  | "in_transit"
  | "completed"
  | "cancelled";

export type CallPriorityType = "normal" | "urgent" | "emergency";

export type ServiceType =
  | "breakdown"
  | "accident"
  | "lockout"
  | "fuel_delivery"
  | "tire_change"
  | "jump_start"
  | "winch_out"
  | "transport"
  | "other";

export type ImpoundStatusType =
  | "active"
  | "pending_release"
  | "released"
  | "auctioned"
  | "junked";

export type ImpoundReasonType =
  | "police_hold"
  | "abandoned"
  | "private_property"
  | "accident"
  | "repo"
  | "storage"
  | "other";

export const STATUS_LABELS: Record<CallStatusType, string> = {
  open: "Open",
  assigned: "Assigned",
  en_route: "En Route",
  on_scene: "On Scene",
  hooked: "Hooked",
  in_transit: "In Transit",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  breakdown: "Breakdown",
  accident: "Accident",
  lockout: "Lockout",
  fuel_delivery: "Fuel Delivery",
  tire_change: "Tire Change",
  jump_start: "Jump Start",
  winch_out: "Winch Out",
  transport: "Transport",
  other: "Other",
};

export const PRIORITY_LABELS: Record<CallPriorityType, string> = {
  normal: "Normal",
  urgent: "Urgent",
  emergency: "Emergency",
};

export const IMPOUND_STATUS_LABELS: Record<ImpoundStatusType, string> = {
  active: "In Lot",
  pending_release: "Pending Release",
  released: "Released",
  auctioned: "Auctioned",
  junked: "Junked",
};

export const IMPOUND_REASON_LABELS: Record<ImpoundReasonType, string> = {
  police_hold: "Police Hold",
  abandoned: "Abandoned",
  private_property: "Private Property",
  accident: "Accident",
  repo: "Repossession",
  storage: "Storage",
  other: "Other",
};
