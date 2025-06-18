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
import { useCreateTags } from "@/hooks/useCreateTags";
import { toast } from "sonner";

const CreateTagForm = () => {
  const initialErrorState = {
    inputString: "", 
    'tags[]': "", 
    general: "", 
  };

  const initialFormState = {
    inputString: "",
    tags: [], 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { createTags, isLoading: isCreating } = useCreateTags();

  const parseInputToTags = (text) => {
    return text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 1);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      inputString: value, 
    }));
    setErrors(initialErrorState)
  };

  function handleAddTags() {
    let newTags = parseInputToTags(formData.inputString);

    if (newTags.length === 0 && formData.tags.length === 0) {
      setErrors((prev) => ({
        ...prev,
        general: "Please enter a tag name to add.",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...new Set([...prev.tags, ...newTags])],
      inputString: "",
    }));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTags();
    }
  }

  const handleRemoveTag = (tagToRemove) => {

    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
    setErrors(initialErrorState)

  };

  const handleOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData(initialFormState); // Reset form data
      setErrors(initialErrorState); // Reset errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tags.length === 0) {
      setErrors((prev) => ({
        ...prev,
        'tags[]': "Please add at least one tag before submitting.",
      }));
      return;
    }

    setErrors(initialErrorState);

    console.log("Final submission of tags:", formData.tags);
    createTags(
      { tags: formData.tags },
      {
        onSuccess: () => {
          toast.success(`Tags successfully added`);
          setIsDialogOpen(false);
          setFormData(initialFormState);
          setErrors(initialErrorState);
        },
        onError: (err) => {
          toast.error(err.error.message || "Failed to add tags.");
          console.log("onError",err.error.fieldErrors["tags[]"])
        //   const backendFieldErrors = err.error?.fieldErrors; 
        //   const tagsErrorMessage = backendFieldErrors?.['tags[]']; 
        //   const generalErrorMessage = err.error?.message || "Failed to add tags.";

        //   toast.error(generalErrorMessage);

        //   setErrors({
        //     inputString: "",
        //     'tags[]': tagsErrorMessage || "", 
        //     general: generalErrorMessage,
        //   });
          setErrors({
            inputString: "",
            'tags[]': err.error.fieldErrors['tags[]'], 
            general: err.error.message || "Failed to add tags.",
          });
        },
      }
    );
  };


  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Tags</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tags</DialogTitle>
          <DialogDescription>
            Enter the names of the new tags. Tags help in describing the content
            more specifically and allow users to find related posts easily.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="inputString">Tag Names</Label>
              <Input
                name="inputString"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                id="inputString"
                type="text"
                value={formData.inputString}
                placeholder="Type tags (e.g., react, css) and press Enter or click 'Add'" 
              />

              {errors.inputString && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.inputString}</AlertDescription>
                </Alert>
              )}

              {formData?.tags.length > 0 && (
                <div className="mt-2">
                  <Label>Added Tags:</Label>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {formData.tags.map((tag) => (
                      <Button
                        variant={"destructive"}
                        onClick={() => handleRemoveTag(tag)}
                        asChild
key={tag}
                      >
                        <li >{tag}</li>
                      </Button>
                    ))}
                  </ul>
                </div>
              )}

              {errors['tags[]']&& ( 
                <Alert variant="destructive">
                  <AlertDescription>{errors['tags[]']}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )} */}
          </div>

          <div className="flex justify-between items-center mt-2">
            <Button
              type="button"
              onClick={handleAddTags}
              disabled={!formData.inputString.trim()}
            >
              Add
            </Button>
            <Button type="submit" disabled={isCreating}>Submit Tags</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagForm;
