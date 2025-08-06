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
import { useRegister } from "@/hooks/useRegister";

export function RegisterForm({ className, ...props }) {
  const initialErrorState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState(initialErrorState);

  const { registerUser, isLoading, error, authData } = useRegister();

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
      name: !formData.name ? "Name is required" : "",
      email: !formData.email ? "Email is required" : "",
      password: !formData.password ? "Password is required" : "",
      confirmPassword: !formData.confirmPassword
        ? "Confirm Password is required"
        : formData.password !== formData.confirmPassword
        ? "Passwords do not match"
        : "",
      general: "",
    };

    const hasErrors =
      newErrors.email ||
      newErrors.password ||
      newErrors.name ||
      newErrors.confirmPassword;
    if (hasErrors) return setErrors(newErrors);

    registerUser(formData, {
      onError: (err) => {
        console.log("Inside registerUser onError");
        setErrors({
          email: err.error.fieldErrors?.email || "",
          name: err.error.fieldErrors?.name || "",
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
          <CardTitle>Register Your account</CardTitle>
          <CardDescription>
            Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  onChange={handleChange}
                  id="name"
                  type="text"
                  value={formData.name}
                  placeholder="Your Name"
                  required
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                  // <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

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
                <Label htmlFor="password">Password</Label>
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

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  onChange={(e) => handleChange(e)}
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  required
                />
                {errors.confirmPassword && (
                  // <p className="text-sm text-red-500">{errors.password}</p>
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
                  Sign up
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
              Already have an account?{" "}
              <Link
                to={"/login"}
                replace
                className="underline underline-offset-4"
              >
                Login
              </Link>
              {/* <a href="/login">Login</a> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
