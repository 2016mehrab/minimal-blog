import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { Alert, AlertDescription } from "./ui/alert";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function ForgotPasswordForm({ className, ...props }) {
  const initialErrorState = {
    email: "",
    general: "",
  };
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState(initialErrorState);
  const navigate =  useNavigate();

  const { sendPasswordResetEmail, isLoading } = useForgotPassword();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail= formData.email.trim();

    const newErrors = {
      email: !formData.email ? "Email is required" : "",
      general: "",
    };

    const hasErrors = newErrors.email;
    if (hasErrors) {
      return setErrors(newErrors);
    }

    sendPasswordResetEmail({email:trimmedEmail}, {
      onError: (err) => {
        console.error("Forgot password error:", err);
        setErrors({
          email: err.error?.fieldErrors?.email || "",
          general: err.error?.message || "An error occurred. Please try again.",
        });
        toast.error(errors.email.length > 0 ? errors.email : errors.general);
      },
      onSuccess: () => {
        setErrors(initialErrorState);
        toast.success(`A password reset token has been sent to your email. Please check your inbox, including spam. The token will expire soon.`);
        setTimeout(() => navigate("/reset-password") , 3000);

      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Your Password?</CardTitle>
          <CardDescription>
            Enter your email address below and we'll send you a token to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  onChange={handleChange}
                  id="email"
                  type="email"
                  value={formData.email}
                  placeholder="m@example.com"
                  required
                />
                {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Token"}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link to={"/login"} className="underline underline-offset-4">
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
