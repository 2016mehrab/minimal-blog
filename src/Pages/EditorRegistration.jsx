import React from "react";
import { toast } from "sonner";
import RegisterForm from "@/components/RegisterForm";
import { useEditorRegister } from "@/hooks/useEditorRegister";

const EditorRegistration = () => {
  const { registerEditor, isLoading, error: errors } = useEditorRegister();

  const handleSubmit = (formData, selectedRole) => {
    console.log("submitted", formData);
    console.log("role", selectedRole);
    const { name, email, password } = formData;
    return new Promise((resolve, reject) => {
      registerEditor(
        { name, email, password },
        {
          onSuccess: (data) => {
            toast.success("Editor registration successful!");
            resolve(data);
          },
          onError: (err) => {
            reject(err);
          },
        }
      );
    });
  };

  return (
    <div className="max-w-2xl mx-auto grid grid-rows-[1fr_5fr_1fr]  min-h-screen ">
      <div></div>
      <RegisterForm
        className=""
        title="Register New Editor"
        description="Enter details for the new editor account"
        submitButtonText="Register Editor"
        availableRoles={["ROLE_EDITOR"]} 
        defaultRole="ROLE_EDITOR" 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        backendErrors={{
          general: errors?.error?.message, 
          fieldErrors: errors?.error?.fieldErrors, 
        }}
      />
      <div className=""></div>
    </div>
  );
};

export default EditorRegistration;
