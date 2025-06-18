import DOMPurify from "dompurify";
import slugify from "slugify";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import constants from "./constants";
import hljs from "highlight.js";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTokenValid(token) {
  if (!token || !token.accessToken || !token.user.exp) return false;
  return Date.now() < token.user.exp - constants.FETCH_IF_EXPIRY_IN * 1000;
}

export function getTruncatedPlainText(htmlString, maxLength = 200) {
  if (!htmlString) {
    return "";
  }
  const sanitizedHtml = DOMPurify.sanitize(htmlString, {
    USE_PROFILES: { html: true },
  });

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitizedHtml;

  ["h1", "h2", "h3", "h4", "h5", "h6", "img", "pre", "code"].forEach((tag) => {
    const headers = tempDiv.querySelectorAll(tag);
    headers.forEach((header) => header.remove());
  });

  let text = tempDiv.textContent || tempDiv.innerText || "";
  text = text.replace(/\s+/g, " ").trim();

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }

  return text;
}

// --- GLOBAL DOMPURIFY CONFIGURATION ---
// It's best to configure DOMPurify once at the entry point of your app
// or in a utility file that's guaranteed to be imported first.
// This ensures the hooks and allowed attributes are set before any sanitization calls.

// Keep track of IDs globally or reset for each call if getSanitizedHTML is called often
// For simplicity in a single file, we'll keep it inside the function for now,
// but be aware that `usedIds` would ideally be managed per `sanitize` call.
// This example will continue to reset it per call, which is safer.

let usedIdsForHeadings = new Set();

// Register the hooks and allowed attributes *globally*
// This is more reliable than passing them directly to `sanitize` when using profiles.
DOMPurify.setConfig({
  ADD_ATTR: ["target", "id", "class"], // Allow 'target' and 'id' globally
  ADD_TAGS: ["span"],
});

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  // Logic for target="_blank" and rel attributes
  if (
    node.tagName === "A" &&
    node.hasAttribute("target") &&
    node.getAttribute("target").toLowerCase() === "_blank"
  ) {
    let rel = node.getAttribute("rel") || "";
    const requiredRel = ["noopener", "noreferrer"];
    requiredRel.forEach((attr) => {
      if (!rel.includes(attr)) {
        if (rel) {
          rel += ` ${attr}`;
        } else {
          rel = attr;
        }
      }
    });
    node.setAttribute("rel", rel.trim());
  }

  if (["H1", "H2", "H3"].includes(node.tagName)) {
    // console.log("Processing heading:", node.tagName, "Text:", node.textContent); // Debugging line
    let id =
      node.id ||
      slugify(node.textContent, {
        lower: true,
        strict: true,
        trim: true,
        replacement: "-",
      });
    let counter = 1;
    let originalId = id;

    while (usedIdsForHeadings.has(id)) {
      id = `${originalId}-${counter}`;
      ++counter;
    }
    usedIdsForHeadings.add(id);
    node.setAttribute("id", id);
    // console.log("Assigned ID:", id); // Debugging line
  }
});

// Reset `usedIdsForHeadings` before each sanitization,
// since the hook is global but the set of used IDs should be per call.
DOMPurify.addHook("beforeSanitizeElements", function () {
  usedIdsForHeadings = new Set();
});

/**
 * Sanitize HTML from given raw HTML
 * @param {string} htmlString - The raw HTML content to sanitize.
 * @returns {string} The sanitized HTML.
 */
export function getSanitizedHTML(htmlString) {
  if (!htmlString) {
    return "";
  }

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  tempDiv.querySelectorAll("pre code").forEach((el) => {
    hljs.highlightElement(el);
  });

  const highlightedHtmlString = tempDiv.innerHTML;

  const sanitizedHtml = DOMPurify.sanitize(highlightedHtmlString, {
    USE_PROFILES: { html: true },
  });

  return sanitizedHtml;
}
