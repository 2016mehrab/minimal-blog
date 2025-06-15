// import { isTokenValid } from "@/lib/utils";
// import { useLocalStorage } from "./useLocalStorage";
// import { refreshToken } from "@/services/auth";
// import { useEffect, useState } from "react";

// export const useUser = () => {
//   const [token, setToken] = useLocalStorage(null, "auth");

//   const [user, setUser] = useState(token?.user || null);
//   const [isLoadingUser, setIsLoadingUser] = useState(true);
//   const [error, setError] = useState(null);

//   console.info("useUser gets called")
//   useEffect(() => {
//     async function initialUserSession() {
//       setIsLoadingUser(true);
//       setError(null);
//       console.info("useUser token", token);

//       if (!isTokenValid(token)) {
//         // Token is missing or expired
//         try {
//           // get token using refreshtoken
//           const newTokenResponse = await refreshToken();
//           console.log("From useUser newToken", newTokenResponse);
//           setToken(newTokenResponse.data);
//           setUser(newTokenResponse.data.user);
//           setError(null);

//         } catch (err) {
//           console.error(
//             "Refresh token error:",
//             err.error?.message || err.message
//           );
//           setToken(null);
//           setUser(null);
//           setError(err.error?.message || err.message);
//         } finally {
//           setIsLoadingUser(false);
//         }
//       } else {
//         // Token is valid
//         setUser(token.user);
//         setIsLoadingUser(false);
//         setError(null);
//       }
//     }

//     initialUserSession();
//   }, []);

//   return { user, isLoading: isLoadingUser, error };
// };

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { refreshToken } from "@/services/auth";
import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useUser() {
  const queryClient = useQueryClient();
  const [_, setToken] = useLocalStorage(null, "auth");

  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Try to refresh token ONCE
      try {
        const { data } = await refreshToken();
        setToken(data);
        return data.user; // Assuming your API returns { user, accessToken }
      } catch (error) {
        console.error("Error setting user",error);
        setToken(null);
        return null;
      }
    },
    retry: false, // Critical: No retries!
  });

  // Sync with queryClient
  useEffect(() => {
    if (user) queryClient.setQueryData(["user"], user);
  }, [user, queryClient]);

  return {
    user,
    isLoading
  };
}
