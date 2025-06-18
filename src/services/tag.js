import constants from "@/lib/constants";
import { apiClient } from "./apiClient";

export const fetchTags= async () => {
  try {
    const URL = constants.API_URL + "tags";
    const response = await apiClient.get(URL, null, { withCredentials: true });

    return response.data;

  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw new Error("Failed to fetch tags");
  }
};


export const createTags= async ({ tags}) => {
  try {
    const URL = constants.API_URL + "tags";
    const response = await apiClient.post(
      URL,
      {
        tags,
      },
      { withCredentials: true }
    );

    console.log("response from create Tags", response.data);
    return response.data;

  } catch (error) {

    console.error("Failed to create tags:", error);
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

export const updateTag= async ({ tagId,tagName }) => {
  try {
    const URL = constants.API_URL + "tags/"+tagId;

    const response = await apiClient.put(
      URL,
      {
        name: tagName,
      },
      { withCredentials: true }
    );

    const { id, name, postCount } = response.data;

    return {
      id,
      name,
      postCount,
    };

  } catch (error) {
    console.error("Failed to update tag name:", error);
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

export const deleteTag= async (id) => {
  try {
    const URL = constants.API_URL + "tags/"+id ;
     await apiClient.delete(URL, null, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Failed to delete tag:", error);
    throw new Error("Failed to delete tag");
  }
};