import axios from "axios";
import constants from "@/lib/constants";
import { jwtDecode } from "jwt-decode";

const URL = constants.API_URL + "auth/login";
export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(URL, {
      email,
      password,
    });

    const { accessToken, expiresIn } = response.data;

      const user = jwtDecode(accessToken);
      console.info(user);

    return {
      success: true,
      data: {
        user,
        accessToken,
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

    throw {
      success: false,
      error: {
        message: errorMessage,
        fieldErrors,
      },
    };
  }
};
