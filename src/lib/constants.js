const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1/";
const IMAGE_BASE = import.meta.env.VITE_BASE || "http://localhost:8080";

const constants = {
  API_URL: API_BASE_URL,
  IMAGE_BASE, 
  FETCH_IF_EXPIRY_IN: 40,
  POST_URL: `${API_BASE_URL}posts`, 
  AUTH_URL: `${API_BASE_URL}auth`,  
  MAX_TAGS_ALLOWED: 5,
  PAGE_SIZE: 5,
  MAX_TAGS_AT_A_TIME: 10,
  PUBLIC_API_ENDPOINTS: ["/categories", "/tags", "/posts"],
};

export default constants;