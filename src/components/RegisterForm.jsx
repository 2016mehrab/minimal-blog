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
import { Link } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Reusable form component for user registration/creation.
 *
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional CSS class for the root div.
 * @param {string} props.title - Title for the card header.
 * @param {string} props.description - Description for the card header.
 * @param {string} props.submitButtonText - Text for the submit button.
 * @param {boolean} [props.showLoginLink=false] - Whether to show the "Already have an account?" link.
 * @param {boolean} [props.showRoleSelect=false] - Whether to show the role selection dropdown.
 * @param {string[]} [props.availableRoles=['ROLE_USER']] - Array of roles to display in the select dropdown if showRoleSelect is true.
 * @param {string} [props.defaultRole='ROLE_USER'] - Default selected role if showRoleSelect is true.
 * @param {function} props.onSubmit - Function to call on form submission (receives formData and selectedRole).
 * @param {boolean} props.isLoading - Loading state for the submit button.
 * @param {object} props.backendErrors - Errors received from the backend API.
 * @param {string} [props.backendErrors.general] - General error message.
 * @param {object} [props.backendErrors.fieldErrors] - Object with field-specific error messages.
 */

const RegisterForm = ({
  className,
  title,
  description,
  submitButtonText,
  showLoginLink = false,
  showRoleSelect = false,
  availableRoles = ["ROLE_USER"],
  defaultRole = "ROLE_USER",
  onSubmit,
  isLoading,
  backendErrors = {},
  ...props
}) => {
  const initialFormState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const initialErrorState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("name", name);
    console.log("value", value);
    console.log("errorstate", errors);
    // Clear client-side errors for the changed field
    setErrors((prev) => ({ ...prev, [name]: "" }));
    // Clear general backend error when user starts typing again
    // Assuming backendErrors.general is a direct prop
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim() ? "Name is required" : "",
      email: !formData.email.trim() ? "Email is required" : "",
      password: !formData.password ? "Password is required" : "",
      confirmPassword: !formData.confirmPassword
        ? "Confirm Password is required"
        : formData.password !== formData.confirmPassword
        ? "Passwords do not match"
        : "",
      general: "",
    };

    setErrors(newErrors);

    // Return true if no client-side errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      await onSubmit(formData, selectedRole);
    } catch (err) {
      console.log("Inside registerUser onError");
      setErrors({
        name: err.error.fieldErrors?.name || "",
        email: err.error.fieldErrors?.email || "",
        password: err.error.fieldErrors?.password || "",
        general: err.error.message || "",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={handleChange}
                  name="password"
                  id="password"
                  type="password"
                  value={formData.password}
                  required
                />
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  onChange={handleChange}
                  name="confirmPassword"
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
                  {submitButtonText}
                </Button>
              </div>
            </div>
            {/* {backendErrors.general && ( // Display general backend error
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className="justify-items-center">
                  {backendErrors.general}
                </AlertDescription>
              </Alert>
            )} */}
            {showLoginLink && (
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  replace
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default RegisterForm;
