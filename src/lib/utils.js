import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import constants from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTokenValid(token) {
  if(!token || !token.accessToken || !token.user.exp) return false;
  return Date.now() < token.user.exp - constants.FETCH_IF_EXPIRY_IN * 1000;
}
