import { Link } from "react-router";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NoTenantView = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                No Organization Found
              </h2>
              <p className="text-muted-foreground">
                You're not currently associated with any organization. Create one
                to get started.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/create-tenant">Create Organization</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoTenantView;
