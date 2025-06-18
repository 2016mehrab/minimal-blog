// single categoryDTO

import constants from "@/lib/constants";
import { apiClient } from "./apiClient";

/*{
id,
name,
postCount
}
*/
export const createCategory = async ({ categoryName }) => {
  try {
    const URL = constants.API_URL + "categories";
    const response = await apiClient.post(
      URL,
      {
        name: categoryName,
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
    console.error("Failed to create category:", error);
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

export const fetchCategories = async () => {
  try {
    const URL = constants.API_URL + "categories";
    const response = await apiClient.get(URL, null, { withCredentials: true });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const updateCategory = async ({ categoryId,categoryName }) => {
  try {
    const URL = constants.API_URL + "categories/"+categoryId;

    const response = await apiClient.put(
      URL,
      {
        name: categoryName,
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
    console.error("Failed to update category:", error);
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

export const deleteCategory= async (id) => {
  try {
    const URL = constants.API_URL + "categories/"+id ;
     await apiClient.delete(URL, null, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw new Error("Failed to delete category");
  }
};