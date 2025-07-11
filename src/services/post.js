import constants from "@/lib/constants";
import { apiClient } from "./apiClient";

export const fetchPosts = async ({ queryKey }) => {
  try {
    const [_key, _, page, sort, categoryId, tagId] = queryKey;
    const params = new URLSearchParams();
    if (categoryId) {
      params.append("categoryId", categoryId);
    }
    if (tagId) {
      params.append("tagId", tagId);
    }

    sort.split(",").forEach((s) => params.append("sort", s));

    params.append("page", Math.max(page - 1, 0));
    const URL = constants.POST_URL + `?${params.toString()}`;
    const response = await apiClient.get(URL, null, { withCredentials: true });

    console.log("fetched published", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch posts");
  }
};

export const getPost = async ({ postId }) => {
  console.log("postid from getPost", postId);
  try {
    const URL = constants.POST_URL + "/" + postId;
    const response = await apiClient.get(URL, null, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve post:", error);
    throw new Error(error.response?.data?.message || "Failed to retrieve post");
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

    console.log("res from create post", response.data);
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

export const fetchDrafts = async ({ queryKey }) => {
  try {
    const [_key, _, page, sort, categoryId, tagId] = queryKey;
    const params = new URLSearchParams();
    params.append("page", Math.max(page - 1, 0));
    if (categoryId) {
      params.append("categoryId", categoryId);
    }
    if (tagId) {
      params.append("tagId", tagId);
    }

    sort.split(",").forEach((s) => params.append("sort", s));

    const URL = constants.POST_URL + "/drafts?" + params.toString();

    const response = await apiClient.get(URL, null, { withCredentials: true });
    console.log("fetch draft", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch drafts:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch drafts");
  }
};

export const fetchPending = async ({ queryKey }) => {
  try {
    const [_key, _status, page, sort, categoryId, tagId] = queryKey;
    const URL = constants.POST_URL + "/pending";
    const urlSearchParams = new URLSearchParams();

    if (categoryId) {
      urlSearchParams.append("categoryId", categoryId);
    }
    if (tagId) {
      urlSearchParams.append("tagId", tagId);
    }
    urlSearchParams.append("page", Math.max(page - 1, 0));
    // urlSearchParams.append("size", size.toString());

    sort.split(",").forEach((s) => urlSearchParams.append("sort", s));

    const fullURL = `${URL}?${urlSearchParams.toString()}`;

    const response = await apiClient.get(fullURL, { withCredentials: true });
    console.log("fetch pending posts", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch pending posts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch pending posts"
    );
  }
};

export const fetchUserPending = async ({ queryKey }) => {
  try {
    const [_key, _status, page, sort, categoryId, tagId] = queryKey;

    const URL = constants.POST_URL + "/user-pending";

    const urlSearchParams = new URLSearchParams();

    if (categoryId) {
      urlSearchParams.append("categoryId", categoryId);
    }
    if (tagId) {
      urlSearchParams.append("tagId", tagId);
    }
    urlSearchParams.append("page", Math.max(page - 1, 0));
    // urlSearchParams.append("size", size.toString());

    sort.split(",").forEach((s) => urlSearchParams.append("sort", s));
    const fullURL = `${URL}?${urlSearchParams.toString()}`;

    const response = await apiClient.get(fullURL, { withCredentials: true });
    console.log("fetched user pending posts", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user pending posts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user pending posts"
    );
  }
};

export const editPost = async (editData) => {
  try {
    const { id, title, content, categoryId, tagIds, status } = editData;
    console.log("id from service", id);
    const URL = constants.POST_URL + `/${id}`;

    const response = await apiClient.put(
      URL,
      {
        id,
        title,
        content,
        categoryId,
        tagIds,
        status,
      },
      { withCredentials: true }
    );
    console.log("fetch draft", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to edit post:", error);
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

export const deletePost = async (id) => {
  try {
    const URL = constants.POST_URL + "/" + id;
    await apiClient.delete(URL, null, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw new Error("Failed to delete post");
  }
};

export const approvePost = async (id) => {
  try {
    const URL = constants.POST_URL + "/" + id + "/approve";
    console.log("url", URL);
    await apiClient.put(URL, null, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Failed to approve post:", error);
    throw new Error("Failed to approve post");
  }
};

export const rejectPost = async (id) => {
  try {
    const URL = constants.POST_URL + "/" + id + "/reject";
    await apiClient.put(URL, null, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Failed to reject post:", error);
    throw new Error("Failed to reject post");
  }
};
