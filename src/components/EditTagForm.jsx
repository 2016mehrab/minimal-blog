import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenIcon} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateTag } from "@/hooks/useUpdateTag";
import { toast } from "sonner";

const EditTagForm = ({tag}) => {
    const { id, name} =tag
    console.log(
"tag in edit", tag
    )
    console.info("tag to edit", id)
    console.info("tag to edit",  name)
  const initialErrorState = {
    name: "",
    general: "",
  };

  const initialFormState = { name: name || "" };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const  { updateTagFn:updateTag , isLoading} = useUpdateTag();


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
    updateTag(
      { tagName: formData.name.trim(), tagId: id },
      {
        onSuccess: (data) => {
          toast.success(`Tag '${data.name}' successfully updated`);
          setIsDialogOpen(false);
          setFormData(prev=> ({...prev, name:data.name}));
          setErrors(initialErrorState);
        },
        onError: (err) => {
          toast.error(err.error.message);
          setErrors({
            name: err.error.fieldErrors?.name || "",
            general: err.error.message || "",
          });
        },
      }
    );
    console.log("Form submitted with data:", formData);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PenIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription>
            {`Update the name for "${name}" category.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Updated Name</Label>
              <Input
                name="name"
                onChange={handleChange}
                id="name"
                type="text"
                value={formData.name}
                placeholder="e.g., react, css"
                required
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )} */}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Save Tag
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTagForm;
