import type React from "react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@c/_generated/api";
import type { Id } from "@c/_generated/dataModel";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Phone, MapPin, Car, AlertTriangle, User } from "lucide-react";
import type { ServiceType, CallPriorityType } from "@/constants";
import { SERVICE_TYPE_LABELS } from "@/constants";

export default function Dispatch() {
  const navigate = useNavigate();
  const createCall = useMutation(api.features.calls.mutations.createCall);
  const createCustomer = useMutation(
    api.features.customers.mutations.createCustomer
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    callerName: "",
    callerPhone: "",
    pickupAddress: "",
    pickupNotes: "",
    dropoffAddress: "",
    dropoffNotes: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehicleLicensePlate: "",
    vehicleCondition: "",
    serviceType: "breakdown" as ServiceType,
    serviceNotes: "",
    priority: "normal" as CallPriorityType,
    saveCustomer: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let customerId: string | undefined;

      if (formData.saveCustomer && formData.callerPhone) {
        customerId = await createCustomer({
          name: formData.callerName,
          phone: formData.callerPhone,
        });
      }

      const callId = await createCall({
        callerName: formData.callerName,
        callerPhone: formData.callerPhone,
        pickupAddress: formData.pickupAddress,
        pickupNotes: formData.pickupNotes || undefined,
        dropoffAddress: formData.dropoffAddress || undefined,
        dropoffNotes: formData.dropoffNotes || undefined,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear || undefined,
        vehicleColor: formData.vehicleColor || undefined,
        vehicleLicensePlate: formData.vehicleLicensePlate || undefined,
        vehicleCondition: formData.vehicleCondition || undefined,
        serviceType: formData.serviceType,
        serviceNotes: formData.serviceNotes || undefined,
        priority: formData.priority,
        customerId: customerId as unknown as Id<"customers"> | undefined,
      });

      navigate(`/calls/${callId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Dispatch</h1>
        <p className="text-muted-foreground">
          Enter call details to dispatch to drivers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Priority Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "urgent", "emergency"] as CallPriorityType[]).map(
                (priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={
                      formData.priority === priority ? "default" : "outline"
                    }
                    className={
                      formData.priority === priority
                        ? priority === "emergency"
                          ? "bg-status-emergency hover:bg-status-emergency/90"
                          : priority === "urgent"
                            ? "bg-status-urgent hover:bg-status-urgent/90"
                            : ""
                        : ""
                    }
                    onClick={() => updateField("priority", priority)}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Caller Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Caller Information
            </CardTitle>
            <CardDescription>
              Search by phone to find existing customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="callerPhone">Phone Number *</Label>
              <Input
                id="callerPhone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.callerPhone}
                onChange={(e) => updateField("callerPhone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callerName">Caller Name *</Label>
              <Input
                id="callerName"
                placeholder="John Doe"
                value={formData.callerName}
                onChange={(e) => updateField("callerName", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Input
                id="pickupAddress"
                placeholder="123 Main St, City, State"
                value={formData.pickupAddress}
                onChange={(e) => updateField("pickupAddress", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupNotes">Pickup Notes</Label>
              <Textarea
                id="pickupNotes"
                placeholder="Landmarks, directions, parking info..."
                value={formData.pickupNotes}
                onChange={(e) => updateField("pickupNotes", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffAddress">Dropoff Address</Label>
              <Input
                id="dropoffAddress"
                placeholder="456 Oak Ave, City, State"
                value={formData.dropoffAddress}
                onChange={(e) => updateField("dropoffAddress", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffNotes">Dropoff Notes</Label>
              <Textarea
                id="dropoffNotes"
                placeholder="Gate code, contact person..."
                value={formData.dropoffNotes}
                onChange={(e) => updateField("dropoffNotes", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="h-4 w-4" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleMake">Make *</Label>
                <Input
                  id="vehicleMake"
                  placeholder="Toyota"
                  value={formData.vehicleMake}
                  onChange={(e) => updateField("vehicleMake", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model *</Label>
                <Input
                  id="vehicleModel"
                  placeholder="Camry"
                  value={formData.vehicleModel}
                  onChange={(e) => updateField("vehicleModel", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  id="vehicleYear"
                  placeholder="2020"
                  value={formData.vehicleYear}
                  onChange={(e) => updateField("vehicleYear", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleColor">Color</Label>
                <Input
                  id="vehicleColor"
                  placeholder="Silver"
                  value={formData.vehicleColor}
                  onChange={(e) => updateField("vehicleColor", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleLicensePlate">License Plate</Label>
              <Input
                id="vehicleLicensePlate"
                placeholder="ABC 1234"
                value={formData.vehicleLicensePlate}
                onChange={(e) =>
                  updateField("vehicleLicensePlate", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleCondition">Vehicle Condition</Label>
              <Textarea
                id="vehicleCondition"
                placeholder="Flat tire, engine won't start, keys locked in..."
                value={formData.vehicleCondition}
                onChange={(e) =>
                  updateField("vehicleCondition", e.target.value)
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-4 w-4" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(v) => updateField("serviceType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceNotes">Additional Notes</Label>
              <Textarea
                id="serviceNotes"
                placeholder="Any other important details..."
                value={formData.serviceNotes}
                onChange={(e) => updateField("serviceNotes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Call..." : "Dispatch Call"}
        </Button>
      </form>
    </div>
  );
}
