import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-6">
      <h1 className="text-6xl sm:text-8xl font-extrabold text-primary mb-4 animate-bounce-slow">
        404
      </h1>
      <h2 className="text-2xl sm:text-4xl font-semibold text-center mb-6">
        Page Not Found
      </h2>
      <p className="text-lg text-center max-w-md mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={handleGoHome}
        className="flex items-center gap-2"
      >
        <HomeIcon className="h-5 w-5" />
        <span>Go to Home</span>
      </Button>
    </div>
  );
};

export default PageNotFound;
