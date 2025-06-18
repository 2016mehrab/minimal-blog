import constants from "@/lib/constants";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { logout, refreshToken } from "./auth";

const queryClient = new QueryClient();
export const apiClient = axios.create({
  baseURL: constants.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.request.use(async (config) => {
  const authDataRaw = localStorage.getItem("auth");
  let authData = authDataRaw ? JSON.parse(authDataRaw) : null;
  let accessToken = authData?.accessToken;
  // may be error
  let tokenExp = authData?.user?.exp;

  if (
    accessToken &&
    tokenExp &&
    Date.now() / 1000 >= tokenExp - constants.FETCH_IF_EXPIRY_IN &&
    !config._retry
  ) {
    if (isRefreshing)
      return (
        new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          })
          //If you just return err, Axios will think it’s a success.
          //To make Axios stop and call your .catch(...) in the frontend code, you must return a rejected Promise.
          .catch((err) => Promise.reject(err))
      );

    isRefreshing = true;

    try {
      const refreshResponse = await refreshToken();
      const newAuthData = refreshResponse.data;
      console.log("Request Fetching new Token ", newAuthData);
      localStorage.setItem("auth", JSON.stringify(newAuthData));
      accessToken = newAuthData.accessToken;
      processQueue(null, accessToken);
      queryClient.invalidateQueries(["user"]);
    } catch (refreshError) {
      console.error("Token refresh failed", refreshError);
      localStorage.removeItem("auth");
      // call the waiting requests
      processQueue(refreshError);

      queryClient.invalidateQueries(["user"]);
      queryClient.clear();
      window.location.href = "/login";

      //If you just return err, Axios will think it’s a success.
      //To make Axios stop and call your .catch(...) in the frontend code, you must return a rejected Promise.
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.info("error response from res intercept", error.response);

    if (
      error?.response?.status === 401 &&
      // dont retry if refresh request fails
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await refreshToken();
        const newAuthData = refreshResponse.data;

        console.info("Response Fetching new Token ", newAuthData);
        localStorage.setItem("auth", JSON.stringify(newAuthData));
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAuthData.accessToken}`;

        // call the waiting requests
        processQueue(null, newAuthData.accessToken);
        queryClient.invalidateQueries(["user"]);
        // queryClient.invalidateQueries(['posts']);

        originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("token refresh failed:", refreshError);

        localStorage.removeItem("auth");

        processQueue(refreshError);

        queryClient.invalidateQueries(["user"]);
        // reset cache
        queryClient.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // some problem with the refresh token
    if (error?.response?.status === 403) {
      console.error(
        "Received 403 Forbidden. Invalidating session and redirecting to login."
      );
      await logout();
      localStorage.removeItem("auth"); 
      queryClient.invalidateQueries(["user"]);
      queryClient.clear(); 
      window.location.href = "/login";
      return Promise.reject(error); 
    }

    return Promise.reject(error);
  }
);
