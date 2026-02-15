import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@c/_generated/api";
import type { Id } from "@c/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ChevronRight, Truck } from "lucide-react";
import { useNavigate } from "react-router";

const OrgPicker = () => {
  const userTenantList = useQuery(api.features.users.queries.getUserTenants);
  const tenantSelector = useMutation(
    api.features.tenants.mutations.selectTenant
  );
  const navigate = useNavigate();

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getPrimaryRole = (roles: string[]): string => {
    const roleHierarchy = ["admin", "dispatcher", "driver"];
    for (const role of roleHierarchy) {
      if (roles.includes(role)) {
        return role.charAt(0).toUpperCase() + role.slice(1);
      }
    }
    return roles[0]?.charAt(0).toUpperCase() + roles[0]?.slice(1) || "Member";
  };

  const handleTenantselection = (tenantId: Id<"tenants">) => {
    tenantSelector({ tenantId }).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Choose Organization
            </CardTitle>
            <CardDescription>
              Select which organization you'd like to access
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pb-6">
            {userTenantList?.map((org) => (
              <Card
                key={org._id}
                className="cursor-pointer transition-all hover:border-primary/50"
                onClick={() => handleTenantselection(org._id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {getInitials(org.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{org.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {getPrimaryRole(org.roles)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            {org.email}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {org.billingPlan} Plan
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTenantselection(org._id);
                          }}
                          className="h-8 px-3 text-xs rounded-full"
                        >
                          Continue
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrgPicker;
