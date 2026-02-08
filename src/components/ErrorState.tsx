import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ErrorStateProps = {
  title: string;
  message: string;
  action?: React.ReactNode;
};

export const ErrorState = ({ title, message, action }: ErrorStateProps) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            {action && <div className="space-y-3">{action}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ErrorState;
