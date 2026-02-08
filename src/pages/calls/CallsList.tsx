import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@c/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CallCard } from "@/components/calls/CallCard";
import type { CallData } from "@/components/calls/CallCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router";
import type { CallStatusType } from "@/constants";
import { STATUS_LABELS } from "@/constants";

export default function CallsList() {
  const [statusFilter, setStatusFilter] = useState<CallStatusType | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const allCalls = useQuery(api.features.calls.queries.allCalls);
  const stats = useQuery(api.features.calls.queries.dashboardStats);

  let filteredCalls = allCalls ?? [];

  if (quickFilter === "active") {
    filteredCalls = filteredCalls.filter(
      (c) => !["completed", "cancelled"].includes(c.status)
    );
  } else if (quickFilter === "completed") {
    filteredCalls = filteredCalls.filter(
      (c) => c.status === "completed" || c.status === "cancelled"
    );
  }

  if (statusFilter !== "all") {
    filteredCalls = filteredCalls.filter((c) => c.status === statusFilter);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredCalls = filteredCalls.filter(
      (c) =>
        c.callNumber.toLowerCase().includes(query) ||
        c.callerName.toLowerCase().includes(query) ||
        c.pickupAddress.toLowerCase().includes(query) ||
        c.vehicleMake.toLowerCase().includes(query) ||
        c.vehicleModel.toLowerCase().includes(query)
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Calls</h1>
          <p className="text-sm text-muted-foreground">
            {filteredCalls.length} calls &bull; {stats?.driversOnShift ?? 0}{" "}
            drivers on shift
          </p>
        </div>
        <Button asChild>
          <Link to="/dispatch">New Call</Link>
        </Button>
      </div>

      {/* Quick Filters */}
      <Tabs
        value={quickFilter}
        onValueChange={(v) =>
          setQuickFilter(v as "all" | "active" | "completed")
        }
      >
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh]">
            <SheetHeader>
              <SheetTitle>Filter Calls</SheetTitle>
              <SheetDescription>Filter by status</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) =>
                    setStatusFilter(v as CallStatusType | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Status Filter Pills */}
      {statusFilter !== "all" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="h-7 gap-1"
          >
            {STATUS_LABELS[statusFilter as CallStatusType]}
            <span className="text-muted-foreground">&times;</span>
          </Button>
        </div>
      )}

      {/* Calls List */}
      <div className="space-y-3">
        {filteredCalls.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No calls found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCalls.map((call) => (
            <CallCard
              key={call._id}
              call={call as unknown as CallData}
              compact
            />
          ))
        )}
      </div>
    </div>
  );
}
