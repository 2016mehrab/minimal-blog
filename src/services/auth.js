import axios from "axios";
import constants from "@/lib/constants";

const URL = constants.API_URL + "auth/login";
export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(URL, {
      email,
      password,
    });

    // Extract the auth response data
    const { accessToken, refreshToken, expiresIn } = response.data;

    // Optionally, you can store the tokens in localStorage or another storage mechanism
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("expiresIn", expiresIn);

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn,
      },
    };
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
    return {
      success: false,
      error: {
        message: errorMessage,
        fieldErrors,
      },
    };
  }
};
