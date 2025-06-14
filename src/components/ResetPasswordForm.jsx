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
import { Alert, AlertDescription } from "./ui/alert";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/useResetPassword";

export function ResetPasswordForm({ className, ...props }) {
  const initialErrorState = {
    newPassword: "",
    confirmPassword: "",
    general: "",
    token: "",
  };

  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState(initialErrorState);
  const navigate = useNavigate();

  const { resetPassword, isLoading } = useResetPassword();

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

    const newErrors = {
      newPassword: "",
      confirmPassword: "",
      token: "",
      general: "",
    };
    if (!formData.token) newErrors.token = "Reset Token is required.";

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const hasErrors = newErrors.newPassword || newErrors.confirmPassword;
    if (hasErrors) {
      return setErrors(newErrors);
    }

    resetPassword(
      { token: formData.token, newPassword: formData.newPassword },
      {
        onError: (err) => {
          console.error("Reset password error:", err);
          const errorMessage =
            err.error?.message ||
            "An error occurred during password reset. Please try again.";
          const fieldErrors = err.error?.fieldErrors || {};

          setErrors({
            newPassword: fieldErrors.newPassword || "",
            confirmPassword: fieldErrors.confirmPassword || "",
            general: errorMessage,
          });

          toast.error(errorMessage);
        },
        onSuccess: (data) => {
          setErrors(initialErrorState);
          toast.success(
            data.message ||
              "Your password has been successfully reset! Please log in."
          );
          setTimeout(() => navigate("/login", { replace: true }), 3000);
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="token">Reset Token</Label>
                <Input
                  name="token"
                  onChange={handleChange}
                  id="token"
                  type="text"
                  value={formData.token}
                  required
                />

                {errors.token && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.token}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  name="newPassword"
                  onChange={handleChange}
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  required
                />
                {errors.newPassword && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.newPassword}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  name="confirmPassword"
                  onChange={handleChange}
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  required
                />
                {errors.confirmPassword && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.confirmPassword}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </div>

            {errors.general && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className={"justify-items-center"}>
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-4 text-center text-sm">
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
