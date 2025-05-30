import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { priorityLabels } from "@/constants";
import { api } from "@c/_generated/api";
import type { Id } from "@c/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Clock, MapPin, MoreHorizontal, Phone, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const OpenJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const calls = useQuery(api.features.jobs.queries.openJobs) || [];
  const claimJob = useMutation(api.features.jobs.mutations.claimJob);

  const filteredCalls = calls.filter(
    (call) =>
      call.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClaimJob = (jobId: Id<"jobs">) => {
    console.log(`Claiming job with ID: ${jobId}`);
    claimJob({ jobId }).catch((error) => {
      toast.error(`Failed to claim job: ${error.message || "Unknown error"}`);
    });
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search open calls..."
            className="pl-8 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCalls.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No open calls available
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-3">
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

                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-end">
                    <Button
                      className="rounded-full"
                      onClick={() => handleClaimJob(call._id)}
                    >
                      Claim Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenJobs;
