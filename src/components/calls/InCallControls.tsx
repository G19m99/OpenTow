import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@c/_generated/api";
import type { CallStatusType } from "@/constants";
import { STATUS_LABELS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowRight, Navigation, Phone, MessageSquare, X } from "lucide-react";
import type { Id } from "@c/_generated/dataModel";

interface InCallControlsProps {
  call: {
    _id: Id<"calls">;
    status: CallStatusType;
    pickupAddress: string;
    callerPhone: string;
  };
}

const statusFlow: Record<CallStatusType, CallStatusType[]> = {
  open: [],
  assigned: ["en_route"],
  en_route: ["on_scene"],
  on_scene: ["hooked"],
  hooked: ["in_transit"],
  in_transit: ["completed"],
  completed: [],
  cancelled: [],
};

const statusDescriptions: Record<CallStatusType, string> = {
  open: "Waiting for driver",
  assigned: "Ready to head out",
  en_route: "On my way to pickup",
  on_scene: "Arrived at location",
  hooked: "Vehicle secured",
  in_transit: "Transporting vehicle",
  completed: "Job complete",
  cancelled: "Call cancelled",
};

export function InCallControls({ call }: InCallControlsProps) {
  const updateStatus = useMutation(
    api.features.calls.mutations.updateCallStatus
  );
  const [notes, setNotes] = useState("");
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const nextStatuses = statusFlow[call.status] ?? [];
  const nextStatus = nextStatuses[0];

  const handleStatusUpdate = async (
    newStatus: CallStatusType,
    statusNotes?: string
  ) => {
    setIsUpdating(true);
    try {
      await updateStatus({
        callId: call._id,
        status: newStatus,
        notes: statusNotes,
      });
      setNotes("");
      setShowNotesDialog(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    await handleStatusUpdate("cancelled", cancelReason);
    setShowCancelDialog(false);
  };

  if (call.status === "completed" || call.status === "cancelled") {
    return null;
  }

  return (
    <Card className="border-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Call Controls</CardTitle>
        <p className="text-sm text-muted-foreground">
          {statusDescriptions[call.status]}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex-col gap-1 h-auto py-3 bg-transparent"
            asChild
          >
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(call.pickupAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-5 w-5" />
              <span className="text-xs">Navigate</span>
            </a>
          </Button>
          <Button
            variant="outline"
            className="flex-col gap-1 h-auto py-3 bg-transparent"
            asChild
          >
            <a href={`tel:${call.callerPhone}`}>
              <Phone className="h-5 w-5" />
              <span className="text-xs">Call</span>
            </a>
          </Button>
          <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-col gap-1 h-auto py-3 bg-transparent"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Notes</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Notes</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Enter any notes about this call..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNotesDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    nextStatus && handleStatusUpdate(nextStatus, notes)
                  }
                  disabled={!nextStatus || isUpdating}
                >
                  Save & Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Status Update */}
        {nextStatus && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => handleStatusUpdate(nextStatus)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              "Updating..."
            ) : (
              <>
                {STATUS_LABELS[nextStatus]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        )}

        {/* Cancel Option */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Call
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Call</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Please provide a reason for cancelling this call.
            </p>
            <Textarea
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Call
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!cancelReason || isUpdating}
              >
                Cancel Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
