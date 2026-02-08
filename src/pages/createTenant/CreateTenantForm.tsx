import { useMutation } from "convex/react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@c/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

const CreateTenantForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const createTenant = useMutation(api.features.tenants.mutations.createTenant);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target as HTMLFormElement);
    e.preventDefault();
    setIsLoading(true);

    try {
      await createTenant({
        name: formData.get("organizationName") as string,
        email: formData.get("email") as string,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      navigate("/", { replace: true });
    } catch {
      toast.error("Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Create Your Organization</h2>
              <p className="text-muted-foreground mt-2">
                Set up your organization to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter contact email for your organization"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTenantForm;
