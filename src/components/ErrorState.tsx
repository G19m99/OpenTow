import React from "react";
import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title: string;
  message: string;
  action?: React.ReactNode;
};

export const ErrorState = ({ title, message, action }: ErrorStateProps) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          {action && <div className="space-y-3">{action}</div>}
        </div>
      </div>
    </div>
  );
};
export default ErrorState;
