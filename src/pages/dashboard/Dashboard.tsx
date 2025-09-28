import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityLabels, statusLabels } from "@/constants";
import { api } from "@c/_generated/api";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import {
  Clock,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";
import DispatchForm from "./components/DispatchForm";
import { hasDashboardAccess } from "./utils";

type Job = FunctionReturnType<typeof api.features.jobs.queries.allJobs>[number];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserRoles = useQuery(
    api.features.users.queries.getCurrentUserRoles
  );
  const jobs = useQuery(api.features.jobs.queries.allJobs) || [];
  const updateJobStatus = useMutation(
    api.features.jobs.mutations.updateJobStatus
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsDispatchOpen(true);
  };

  const handleCancelJob = (job: Job) => {
    updateJobStatus({ id: job._id, status: "cancelled" });
    toast.success("Job cancelled successfully");
  };

  const filteredJobs = jobs
    .filter(
      (job) =>
        job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job._id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((job) => activeTab === "all" || job.status === activeTab);

  const handleDialogOpenChange = () => {
    if (isDispatchOpen) {
      setEditingJob(null);
      setIsDispatchOpen(false);
    }
  };

  if (!currentUserRoles) return null;

  if (!hasDashboardAccess(currentUserRoles || [])) {
    return <Navigate to="open-jobs" />;
  }

  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs..."
            className="pl-8 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="rounded-full"
            onClick={() => setIsDispatchOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="in_progress">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No jobs found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card
              key={job._id}
              className="overflow-hidden border-none shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-base flex items-center gap-2 capitalize">
                      {job.customerName}
                      <Badge
                        variant={priorityLabels[job.priority].variant}
                        className="rounded-full text-xs"
                      >
                        {priorityLabels[job.priority].label}
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {job._id} • {job.vehicleInfo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={statusLabels[job.status].variant}
                      className="rounded-full"
                    >
                      {statusLabels[job.status].label}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditJob(job)}>
                          Edit job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => handleCancelJob(job)}
                        >
                          Cancel job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{job.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{new Date(job.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Assigned to:{" "}
                      </span>
                      <span className="font-medium">
                        {job.driverName || "Unassigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dispatch Dialog */}
      <Dialog open={isDispatchOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          <DispatchForm
            setIsFormOpen={setIsDispatchOpen}
            defaultValues={editingJob}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
