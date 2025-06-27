import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlertIcon, RefreshCcwIcon, HomeIcon } from "lucide-react";

// Assuming AppError is defined and imported correctly, e.g., from '@/lib/AppError'
import { AppError } from "@/lib/AppError";

function ErrorFallback({ error, resetErrorBoundary }) {
  const isAppError = error instanceof AppError;
  const isNotFoundError = isAppError && error.status === 404;

  const displayTitle = isNotFoundError ? "Not Found" : "Something Went Wrong!";
  const displayMessage = isAppError
    ? error.userMessage
    : "An unexpected error occurred. Please try again later.";
  const shouldShowDetails = isAppError ? error.showDetails : true;

  let buttonAction;
  let buttonText;
  let buttonIcon;

  buttonAction = () => {
    window.location.href = "/";
  };
  buttonText = "Go Back Home";
  buttonIcon = <HomeIcon className="h-4 w-4" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-lg rounded-xl">
        <CardHeader className="bg-destructive text-destructive-foreground rounded-t-xl py-4 flex flex-col items-center gap-2">
          <TriangleAlertIcon className="h-12 w-12" />
          <CardTitle className="text-2xl font-bold">{displayTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-foreground">{displayMessage}</p>

          {shouldShowDetails && (
            <pre className="bg-muted p-4 rounded-lg text-left overflow-auto text-destructive border border-border">
              <code>{error.message}</code>
            </pre>
          )}

          <div>
            <Button
              onClick={buttonAction}
              className="w-full max-w-xs mx-auto mt-4"
            >
              {buttonIcon}
              <span>{buttonText}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorFallback;
