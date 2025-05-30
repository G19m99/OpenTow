import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@c/_generated/api";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { AlertCircle, Car, MapPin, Phone } from "lucide-react";
import type React from "react";
import { toast } from "sonner";

type Priority = "high" | "normal" | "low";

type Job = FunctionReturnType<typeof api.features.jobs.queries.allJobs>[number];
type DispatchFormProps = {
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues?: Job | null;
};
const DispatchForm = ({ setIsFormOpen, defaultValues }: DispatchFormProps) => {
  const drivers = useQuery(api.features.users.queries.getDrivers);
  const createJob = useMutation(api.features.jobs.mutations.createJob);
  const editJob = useMutation(api.features.jobs.mutations.updateJob);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const driver = formData.get("driver");
    const driverData = driver ? JSON.parse(driver as string) : null;

    const jobData = {
      driverId: driverData?.driverId,
      driverName: driverData?.driverName,
      location: formData.get("location") as string,
      customerName: formData.get("customerName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      vehicleInfo: formData.get("vehicleInfo") as string,
      description: formData.get("description") as string,
      priority: (formData.get("priority") || "normal") as Priority,
    };
    if (defaultValues) {
      editJob({
        id: defaultValues._id,
        ...jobData,
      })
        .then(() => {
          toast.success("Job Updated!");
          setIsFormOpen(false);
        })
        .catch((error) => {
          console.error("Error updating job:", error);
          toast.error("Failed to update job. Please try again.");
        });
      return;
    }

    createJob(jobData)
      .then(() => {
        toast.success("Job Dispatched!");
        setIsFormOpen(false);
      })
      .catch((error) => {
        console.error("Error creating job:", error);
        toast.error("Failed to create job. Please try again.");
      });
  };

  const driverDefault = defaultValues?.driverId
    ? JSON.stringify({
        driverId: defaultValues.driverId,
        driverName: defaultValues.driverName,
      })
    : "";

  if (!drivers) return <div>Loading drivers...</div>;

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                required
                className="rounded-full"
                defaultValue={defaultValues?.customerName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  className="pl-10 rounded-full"
                  defaultValue={defaultValues?.customerPhone}
                  type="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  required
                  className="pl-10 rounded-full"
                  defaultValue={defaultValues?.location}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleInfo">Vehicle Information</Label>
              <div className="relative">
                <Car className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="vehicleInfo"
                  name="vehicleInfo"
                  placeholder="Year, Make, Model, Color"
                  required
                  className="pl-10 rounded-full"
                  defaultValue={defaultValues?.vehicleInfo}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Additional details about the tow request"
                rows={3}
                className="rounded-xl"
                defaultValue={defaultValues?.description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverId">Assign Driver</Label>
              <Select name="driver" defaultValue={driverDefault}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers?.map((driver) => (
                    <SelectItem
                      key={driver._id}
                      value={JSON.stringify({
                        driverId: driver._id,
                        driverName: driver.name,
                      })}
                    >
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                name="priority"
                defaultValue={defaultValues?.priority || "normal"}
              >
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full rounded-full">
              {defaultValues ? "update Job" : "Create Dispatch"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DispatchForm;
