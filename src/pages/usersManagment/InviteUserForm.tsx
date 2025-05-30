import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { roles } from "@/constants";
import { Plus } from "lucide-react";
import React, { useState } from "react";

type InviteUserFormProps = {
  inviteDialogOpen: boolean;
  setInviteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleInviteUser: (e: React.FormEvent<HTMLFormElement>) => void;
};

const InviteUserForm = ({
  inviteDialogOpen,
  setInviteDialogOpen,
  handleInviteUser,
}: InviteUserFormProps) => {
  const [roleStates, setRoleStates] = useState<Record<string, boolean>>(
    roles.reduce((acc, role) => ({ ...acc, [role]: false }), {})
  );

  const handleRoleChange = (role: string, checked: boolean) => {
    setRoleStates((prev) => ({ ...prev, [role]: checked }));
  };

  return (
    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
      <DialogTrigger>
        <Button className="rounded-full" asChild>
          <span>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account and assign roles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInviteUser}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                className="rounded-full"
              />
            </div>
            <div className="grid gap-2">
              <Label>Roles</Label>
              <div className="grid grid-cols-1 gap-4">
                {roles.map((role) => (
                  <div key={role} className="flex items-center justify-between">
                    <Label htmlFor={`role-${role}`} className="cursor-pointer">
                      {role}
                    </Label>
                    <Switch
                      id={`role-${role}`}
                      checked={roleStates[role]}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role, checked)
                      }
                    />
                    <input
                      type="hidden"
                      name={`role-${role}`}
                      value={roleStates[role] ? "true" : "false"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full">
              Invite User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserForm;
