import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
import { registerEditor as register } from "@/services/auth";

export const useEditorRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [_, setToken] = useLocalStorage(null, "auth");

  const {
    mutate: registerEditor,
    isPending: isLoading,
    error,
    data: authData,
  } = useMutation({
    mutationFn: ({ name, email, password }) =>
      register({ name, email, password }),
    onSuccess: (rawAuthData) => {
      //   setToken(rawAuthData.data);

      //   queryClient.setQueryData(["user"], rawAuthData.data.user);

      navigate("/home", { replace: true });
    },
    onError: (err) => {
      console.error("error", err);
    },
  });

  return { registerEditor, isLoading, error, authData };
};
