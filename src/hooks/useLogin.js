import { login } from "@/services/auth";
import { useState } from "react";

export const useLogin = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authData, setAuthData] = useState(null);

  const loginUser = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    setAuthData(null);

    const result = await login({ email, password });

    if (result.success) {
      setAuthData(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
    return result;
  };
  return { loginUser, isLoading, error, authData };
};
