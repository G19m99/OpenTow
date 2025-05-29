import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@c/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Mail, Search } from "lucide-react";
import { useState } from "react";
import InviteUserForm from "./InviteUserForm";
import { roles, type RolesType } from "@/constants";
import type { Id } from "@c/_generated/dataModel";

export default function UserManagement() {
  const users = useQuery(api.features.users.queries.getUsers);
  console.log("Users from query:", users);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const changeRoles = useMutation(
    api.features.users.mutations.changeUserRoleAccess
  );

  const filteredUsers = users
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleRoleToggle = (role: RolesType, userId: Id<"users">) => {
    console.log(`Toggling role ${role} for user ${userId}`);
    changeRoles({
      userId: userId,
      role: {
        name: role,
        active: !filteredUsers
          .find((u) => u._id === userId)
          ?.roles.includes(role),
      },
    });
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Adding new user:", {
      email: formData.get("email"),
      roles: formData.getAll("roles"),
    });
    setIsAddUserOpen(false);
  };

  const handleStatusToggle = (userId: string) => {
    console.log(`Deleting user with ID: ${userId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (users === undefined) return <div>Loading...</div>;
  return (
    <div className="my-1">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search users..."
            className="rounded-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <InviteUserForm
          inviteDialogOpen={isAddUserOpen}
          setInviteDialogOpen={setIsAddUserOpen}
          handleInviteUser={handleAddUser}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-muted-foreground py-10 text-center">
          No users found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card
              key={user._id}
              className="overflow-hidden border-none shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(user.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold">{user.name}</h3>
                        <div className="text-muted-foreground flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={true}
                          onCheckedChange={() => handleStatusToggle(user._id)}
                          aria-label="Toggle status"
                        />
                        <Badge variant={"default"} className="rounded-full">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="grid gap-3">
                    <div className="text-sm font-medium">User Roles</div>
                    <div className="grid grid-cols-1 gap-2">
                      {roles.map((role) => (
                        <div
                          key={role}
                          className="flex items-center justify-between"
                        >
                          <Label
                            htmlFor={`user-${user._id}-role-${role}`}
                            className="cursor-pointer capitalize"
                          >
                            {role}
                          </Label>
                          <Switch
                            id={`user-${user._id}-role-${role}`}
                            checked={user.roles.includes(role)}
                            onCheckedChange={() =>
                              handleRoleToggle(role, user._id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
