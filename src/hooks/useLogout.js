import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
import { logout as logoutService } from "@/services/auth";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [_, setToken] = useLocalStorage(null, "auth");

  const {
    mutate: logoutUser,
    isPending: isLoggingOut,
    error: logoutError, 
  } = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      setToken(null); 
      queryClient.clear(); 
      navigate("/login", { replace: true }); 
      toast.success("You have been successfully logged out.");
      console.log("User successfully logged out.");
    },
    onError: (err) => {

      console.error("Logout failed on server:", err);
      toast.error(err?.message || "Something went wrong.");
      setToken(null);
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  return { logoutUser, isLoggingOut, logoutError };
};
