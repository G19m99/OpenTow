type LoadingSpinnerProps = {
  message: string;
  size?: "sm" | "md" | "lg";
};

export const LoadingSpinner = ({
  message,
  size = "md",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-2 border-border border-t-primary ${sizeClasses[size]} mx-auto mb-4`}
        />
        <p className="text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
