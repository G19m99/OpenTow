import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const getBillingPlanDisplay = (plan: string): string => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const handleTenantselection = (tenantId: Id<"tenants">) => {
    tenantSelector({
      tenantId,
    }).then(() => {
      navigate("/dashboard", { replace: true });
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md h-full ">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Choose Organization
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select which organization you'd like to access
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pb-6">
            {userTenantList?.map((org) => (
              <Card
                key={org._id}
                className={`cursor-pointer transition-all border hover:border-gray-300 border-gray-200`}
                onClick={() => handleTenantselection(org._id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                      {getInitials(org.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {org.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-600 border-0"
                        >
                          {getPrimaryRole(org.roles)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-500">
                            {org.email}
                          </span>
                          <span className="text-xs text-gray-400">
                            {getBillingPlanDisplay(org.billingPlan)} Plan
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTenantselection(org._id);
                          }}
                          className="bg-black hover:bg-gray-800 text-white h-8 px-3 text-xs rounded-full"
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

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Manage Organizations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrgPicker;
