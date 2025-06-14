import { isTokenValid } from "@/lib/utils";
import { useLocalStorage } from "./useLocalStorage";
import { refreshToken } from "@/services/auth";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [token, setToken] = useLocalStorage(null, "auth");

  const [user, setUser] = useState(token?.user || null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initialUserSession() {
      setIsLoadingUser(true);
      setError(null);
      console.info("useUser token", token);

      if (!isTokenValid(token)) {
        // Token is missing or expired
        try {
          // get token using refreshtoken
          const newTokenResponse = await refreshToken();
          console.log("From useUser newToken", newTokenResponse);
          setToken(newTokenResponse.data);
          setUser(newTokenResponse.data.user);
          setError(null);
        } catch (err) {
          console.error(
            "Refresh token error:",
            err.error?.message || err.message
          );
          setToken(null);
          setUser(null);
          setError(err.error?.message || err.message);
        } finally {
          setIsLoadingUser(false);
        }
      } else {
        // Token is valid
        setUser(token.user);
        setIsLoadingUser(false);
        setError(null);
      }
    }

    initialUserSession();
  }, []);

  return { user, isLoading: isLoadingUser, error };
};
