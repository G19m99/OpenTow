import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityLabels, statusLabels, type StatusType } from "@/constants";
import { api } from "@c/_generated/api";
import type { Id } from "@c/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  CheckCircle,
  Clock,
  MapPin,
  MoreHorizontal,
  Phone,
  Play,
} from "lucide-react";
import { useState } from "react";

const MyJobs = () => {
  const jobs = useQuery(api.features.jobs.queries.usersJobs) || [];
  const updateJobStatus = useMutation(
    api.features.jobs.mutations.updateJobStatus
  );
  const [activeTab, setActiveTab] = useState("all");

  const filteredCalls = (
    activeTab === "all"
      ? jobs
      : jobs.filter((call) => call.status === activeTab)
  ).filter((job) => job.status !== "completed");

  const updateCallStatus = (callId: Id<"jobs">, newStatus: StatusType) => {
    updateJobStatus({ id: callId, status: newStatus });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="assigned">New</TabsTrigger>
          <TabsTrigger value="in_progress">Active</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredCalls.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No jobs found in this category
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCalls.map((call) => (
            <Card
              key={call._id}
              className="overflow-hidden border-none shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      {call.customerName}
                      <Badge
                        variant={priorityLabels[call.priority].variant}
                        className="rounded-full text-xs"
                      >
                        {priorityLabels[call.priority].label}
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {call._id} • {call.vehicleInfo}
                    </p>
                  </div>
                  <Badge
                    variant={statusLabels[call.status].variant}
                    className="rounded-full"
                  >
                    {statusLabels[call.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{call.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{call.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{call.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{new Date(call.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center gap-2">
                  {call.status === "assigned" && (
                    <Button
                      onClick={() => updateCallStatus(call._id, "in_progress")}
                      className="flex-1 rounded-full"
                      size="sm"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Job
                    </Button>
                  )}
                  {call.status === "in_progress" && (
                    <Button
                      onClick={() => updateCallStatus(call._id, "completed")}
                      className="flex-1 rounded-full"
                      size="sm"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="rounded-full">
                    Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Call Customer</DropdownMenuItem>
                      <DropdownMenuItem>Get Directions</DropdownMenuItem>
                      <DropdownMenuItem>Request Assistance</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
