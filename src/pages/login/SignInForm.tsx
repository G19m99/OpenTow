import { SignInWithGoogle } from "@/auth/oauth/SignInWithGoogle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import { Navigate } from "react-router";

export function SignInForm() {
  return (
    <React.Fragment>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <Truck className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                Welcome to OpenTow
              </CardTitle>
              <CardDescription className="text-center">
                Modern dispatch software for towing services
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <SignInWithGoogle />
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Navigate to="/" replace />
      </Authenticated>
    </React.Fragment>
  );
}
