import constants from "@/lib/constants";
import { apiClient } from "./apiClient";

export const fetchPosts = async () => {
  try {
    const URL = constants.POST_URL;
    const response = await apiClient.get(URL, null, { withCredentials: true });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

export const getPost = async ({postId}) => {
    console.log("postid from getPost", postId)
  try {
    const URL = constants.POST_URL+"/"+postId;
    const response = await apiClient.get(URL, null, { withCredentials: true });
    return response.data;

  } catch (error) {
    console.error("Failed to retrieve post:", error);
    throw new Error("Failed to retrieve post");
  }
};

export const createPost = async ({
  title,
  content,
  categoryId,
  tagIds,
  status,
}) => {
  try {
    const URL = constants.POST_URL;
    const response = await apiClient.post(
      URL,
      {
        title,
        content,
        categoryId,
        tagIds,
        status,
      },
      { withCredentials: true }
    );

    console.log( "res from create post",response.data);
    return null;

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
