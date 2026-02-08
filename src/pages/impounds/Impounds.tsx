import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImpoundStatusBadge } from "@/components/ui/status-badge";
import { Search, Plus, Warehouse, DollarSign } from "lucide-react";
import type { ImpoundStatusType, ImpoundReasonType } from "@/constants";
import { IMPOUND_REASON_LABELS } from "@/constants";
import { toast } from "sonner";

export default function Impounds() {
  const impounds = useQuery(api.features.impounds.queries.allImpounds);
  const stats = useQuery(api.features.impounds.queries.impoundStats);
  const createImpound = useMutation(
    api.features.impounds.mutations.createImpound
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | ImpoundStatusType>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  let filteredImpounds = impounds ?? [];

  if (statusTab !== "all") {
    filteredImpounds = filteredImpounds.filter((i) => i.status === statusTab);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredImpounds = filteredImpounds.filter(
      (i) =>
        (i.vehicleLicensePlate ?? "").toLowerCase().includes(q) ||
        i.vehicleMake.toLowerCase().includes(q) ||
        i.vehicleModel.toLowerCase().includes(q) ||
        (i.ownerName ?? "").toLowerCase().includes(q)
    );
  }

  const [form, setForm] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehicleLicensePlate: "",
    vehicleCondition: "",
    ownerName: "",
    ownerPhone: "",
    reason: "storage" as ImpoundReasonType,
    reasonNotes: "",
    lotLocation: "",
    dailyRate: "50",
    towFee: "",
    adminFee: "",
    notes: "",
  });

  const handleAddImpound = async () => {
    try {
      await createImpound({
        vehicleMake: form.vehicleMake,
        vehicleModel: form.vehicleModel,
        vehicleYear: form.vehicleYear || undefined,
        vehicleColor: form.vehicleColor || undefined,
        vehicleLicensePlate: form.vehicleLicensePlate || undefined,
        vehicleCondition: form.vehicleCondition || undefined,
        ownerName: form.ownerName || undefined,
        ownerPhone: form.ownerPhone || undefined,
        reason: form.reason,
        reasonNotes: form.reasonNotes || undefined,
        lotLocation: form.lotLocation || undefined,
        dailyRate: Number(form.dailyRate) || 50,
        towFee: form.towFee ? Number(form.towFee) : undefined,
        adminFee: form.adminFee ? Number(form.adminFee) : undefined,
        notes: form.notes || undefined,
      });
      toast.success("Impound added");
      setIsAddOpen(false);
    } catch {
      toast.error("Failed to add impound");
    }
  };

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Impound Lot</h1>
          <p className="text-sm text-muted-foreground">
            Manage impounded vehicles
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Impound
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Impound</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Make *</Label>
                  <Input
                    value={form.vehicleMake}
                    onChange={(e) => updateForm("vehicleMake", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Model *</Label>
                  <Input
                    value={form.vehicleModel}
                    onChange={(e) => updateForm("vehicleModel", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Year</Label>
                  <Input
                    value={form.vehicleYear}
                    onChange={(e) => updateForm("vehicleYear", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Color</Label>
                  <Input
                    value={form.vehicleColor}
                    onChange={(e) => updateForm("vehicleColor", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>License Plate</Label>
                <Input
                  value={form.vehicleLicensePlate}
                  onChange={(e) =>
                    updateForm("vehicleLicensePlate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Owner Name</Label>
                <Input
                  value={form.ownerName}
                  onChange={(e) => updateForm("ownerName", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Owner Phone</Label>
                <Input
                  value={form.ownerPhone}
                  onChange={(e) => updateForm("ownerPhone", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Reason *</Label>
                <Select
                  value={form.reason}
                  onValueChange={(v) => updateForm("reason", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(IMPOUND_REASON_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Lot Location</Label>
                <Input
                  value={form.lotLocation}
                  onChange={(e) => updateForm("lotLocation", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Daily Rate *</Label>
                  <Input
                    type="number"
                    value={form.dailyRate}
                    onChange={(e) => updateForm("dailyRate", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Tow Fee</Label>
                  <Input
                    type="number"
                    value={form.towFee}
                    onChange={(e) => updateForm("towFee", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Admin Fee</Label>
                  <Input
                    type="number"
                    value={form.adminFee}
                    onChange={(e) => updateForm("adminFee", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  rows={2}
                />
              </div>
              <Button className="w-full" onClick={handleAddImpound}>
                Add Impound
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-status-open" />
              <div>
                <p className="text-xl font-bold">{stats?.inLot ?? 0}</p>
                <p className="text-xs text-muted-foreground">In Lot</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-status-urgent" />
              <div>
                <p className="text-xl font-bold">
                  {stats?.pendingRelease ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-status-completed" />
              <div>
                <p className="text-xl font-bold">
                  {stats?.releasedThisMonth ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Released</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-status-urgent" />
              <div>
                <p className="text-xl font-bold">
                  ${(stats?.outstanding ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by plate, vehicle, owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Tabs */}
      <Tabs
        value={statusTab}
        onValueChange={(v) => setStatusTab(v as "all" | ImpoundStatusType)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1">
            In Lot
          </TabsTrigger>
          <TabsTrigger value="pending_release" className="flex-1">
            Pending
          </TabsTrigger>
          <TabsTrigger value="released" className="flex-1">
            Released
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Impound Cards */}
      <div className="space-y-3">
        {filteredImpounds.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No impounds found</p>
            </CardContent>
          </Card>
        ) : (
          filteredImpounds.map((impound) => (
            <Card key={impound._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      {impound.vehicleColor && `${impound.vehicleColor} `}
                      {impound.vehicleYear} {impound.vehicleMake}{" "}
                      {impound.vehicleModel}
                    </p>
                    {impound.vehicleLicensePlate && (
                      <p className="text-sm text-muted-foreground">
                        Plate: {impound.vehicleLicensePlate}
                      </p>
                    )}
                  </div>
                  <ImpoundStatusBadge
                    status={impound.status as ImpoundStatusType}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reason: </span>
                    {IMPOUND_REASON_LABELS[impound.reason as ImpoundReasonType]}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate: </span>$
                    {impound.dailyRate}/day
                  </div>
                  {impound.ownerName && (
                    <div>
                      <span className="text-muted-foreground">Owner: </span>
                      {impound.ownerName}
                    </div>
                  )}
                  {impound.lotLocation && (
                    <div>
                      <span className="text-muted-foreground">Lot: </span>
                      {impound.lotLocation}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
