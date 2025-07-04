/* eslint-disable no-unused-vars */
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
import { useLogin } from "@/hooks/useLogin";
import { Alert, AlertDescription } from "./ui/alert";
import { Link } from "react-router";

export function LoginForm({ className, ...props }) {
  const initialErrorState = {
    email: "",
    password: "",
    general: "",
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(initialErrorState);

  const { loginUser, isLoading, error, authData } = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(initialErrorState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: !formData.email ? "Email is required" : "",
      password: !formData.password ? "Password is required" : "",
      general: "",
    };

    const hasErrors = newErrors.email || newErrors.password;
    if (hasErrors) return setErrors(newErrors);

    loginUser(formData, {
      onError: (err) => {
        console.log("inside loginform");
        setErrors({
          email: err.error.fieldErrors?.email || "",
          password: err.error.fieldErrors?.password || "",
          general: err.error.message || "",
        });
      },
      onSuccess: (data) => {
        setErrors(initialErrorState);
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                  // <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={"/forgot-password"}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  onChange={(e) => handleChange(e)}
                  name="password"
                  id="password"
                  type="password"
                  value={formData.password}
                  required
                />
                {errors.password && (
                  // <p className="text-sm text-red-500">{errors.password}</p>
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  Login
                </Button>
              </div>
            </div>
            {errors.general && (
              <Alert variant="destructive">
                <AlertDescription className={"justify-items-center"}>
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to={"/register"}
                replace
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
              {/* <a href="/register" className="underline underline-offset-4">
                Sign up
              </a> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
