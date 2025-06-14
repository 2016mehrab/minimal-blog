import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth"; // Your service function

export const useForgotPassword = () => {
  const {
    mutate: sendPasswordResetEmail,
    isPending: isLoading,
    error,
    isSuccess, // You might want this to show the success message
  } = useMutation({
    mutationFn: ({ email }) => forgotPassword({ email }),
    onSuccess: () => {
      console.log("Forgot password request successfully sent.");
    },
    onError: (err) => {
      console.error("Error sending forgot password request:", err);
    },
  });

  return { sendPasswordResetEmail, isLoading, error, isSuccess };
};