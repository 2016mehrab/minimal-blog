import axios from "axios";
import constants from "@/lib/constants";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "./apiClient";

export const login = async ({ email, password }) => {
  try {
    const URL = constants.API_URL + "auth/login";
    const response = await axios.post(
      URL,
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    const { accessToken, expiresIn } = response.data;

    const user = getFormattedToken(accessToken, expiresIn);

    return user;
  } catch (error) {
    console.error("Login failed:", error);
    let errorMessage = "An error occurred. Please try again later.";
    let fieldErrors = {};

    if (error.response) {
      if (error.response.status === 400 && error.response.data.errors) {
        errorMessage = error.response.data.message;
        error.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    }

    throw {
      success: false,
      error: {
        message: errorMessage,
        fieldErrors,
      },
    };
  }
};

export const logout = async () => {
  try {
    const URL = constants.API_URL + "auth/logout";
    await axios.post(URL, null, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Logout failed:", error.message);
    throw new Error("Something happended try again later");
  }
};

export const register = async ({ name, email, password }) => {
  try {
    const URL = constants.API_URL + "auth/register";
    const response = await axios.post(
      URL,
      {
        name,
        email,
        password,
      },
      { withCredentials: true }
    );

    const { accessToken, expiresIn } = response.data;

    const user = getFormattedToken(accessToken, expiresIn);

    return user;
  } catch (error) {
    console.error("Registration failed:", error);

    let errorMessage = "An error occurred. Please try again later.";
    let fieldErrors = {};

    if (error.response) {
      if (error.response.status === 400 && error.response.data.errors) {
        errorMessage = error.response.data.message;
        error.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    }

    throw {
      success: false,
      error: {
        message: errorMessage,
        fieldErrors,
      },
    };
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const URL = constants.API_URL + "auth/forgot-password?email=" + email;
    await axios.post(URL);
    return true;
  } catch (e) {
    console.error("Service error", e.message);
    throw new Error("Something happended try again later");
  }
};

export const resetPassword = async ({ token, newPassword }) => {
  try {
    const URL = constants.API_URL + "auth/reset-password";
    await axios.post(URL, {
      token,
      newPassword,
    });

    return { success: true, message: "Password reset successful!" };
  } catch (error) {
    let errorMessage = "An error occurred. Please try again later.";
    let fieldErrors = {};

    if (error.response) {
      if (error.response.data.errors) {
        errorMessage = error.response.data.message;
        error.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    }

    throw {
      success: false,
      error: {
        message: errorMessage,
        fieldErrors,
      },
    };
  }
};

export const refreshToken = async () => {
  const URL = constants.API_URL + "auth/refresh-token";
  try {
    const res = await axios.post(URL, null, {
      withCredentials: true,
    });
    const user = getFormattedToken(res.data.accessToken, res.data.expiresIn);
    return user;
  } catch (error) {
    console.error("Refresh token failed", error);
    throw {
      success: false,
      error: {
        message: error.message,
      },
    };
  }
};

export const registerEditor = async ({ name, email, password }) => {
  try {
    const URL = constants.AUTH_URL+"/register-editor";
    console.table({name ,email, password})
    console.log("URL",URL);
    const response = await apiClient.post(
      URL,
      {
        name,
        email,
        password,
      },
      { withCredentials: true }
    );

    const { accessToken, expiresIn } = response.data;

    const user = getFormattedToken(accessToken, expiresIn);

    return user;

  } catch (error) {
    console.error("Registration failed:", error);

    let errorMessage = "An error occurred. Please try again later.";
    let fieldErrors = {};

    if (error.response) {
      if (error.response.status === 400 && error.response.data.errors) {
        errorMessage = error.response.data.message;
        error.response.data.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    }

    throw {
      success: false,
      error: {
        message: errorMessage,
        fieldErrors,
      },
    };
  }
};

function getFormattedToken(accessToken, expiresIn) {
  const user = jwtDecode(accessToken);

  return {
    success: true,
    data: {
      user,
      accessToken,
      expiresIn,
    },
  };
}
