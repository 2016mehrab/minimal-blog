import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { toast } from "sonner";

const CreateCategoryForm = () => {
  const initialErrorState = {
    name: "",
    general: "",
  };
  const initialFormState = { name: "" };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const { createCategory, isLoading } = useCreateCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData(initialFormState); 
      setErrors(initialErrorState); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      general: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required.";
    }

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    createCategory(
      { categoryName: formData.name },
      {
        onSuccess: (data) => {
          toast.success(`Category '${data.name}' successfully added`);
          setIsDialogOpen(false);
          setFormData(initialFormState);
          setErrors(initialErrorState);
        },
        onError: (err) => {
          toast.error(err.error.message);
        },
      }
    );

    console.log("Form submitted with data:", formData);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Enter the name for a new category. This will help in organizing the
            blogs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Category Name</Label>
              <Input
                name="name"
                onChange={handleChange}
                id="name"
                type="text"
                value={formData.name}
                placeholder="e.g., Programming, Math, History"
                required
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Add Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryForm;
