import { useQuery } from "@tanstack/react-query";
import { refreshToken } from "@/services/auth";
import { useLocalStorage } from "./useLocalStorage";

export function useUser() {
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
  // useEffect(() => {
  //   if (user) queryClient.setQueryData(["user"], user);
  // }, [user, queryClient]);

  return {
    user,
    isLoading
  };
}
