import { clsx } from "clsx";
import DOMPurify from 'dompurify';
import { twMerge } from "tailwind-merge";
import constants from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTokenValid(token) {
  if(!token || !token.accessToken || !token.user.exp) return false;
  return Date.now() < token.user.exp - constants.FETCH_IF_EXPIRY_IN * 1000;
}


/**
 * Strips HTML headers (h1-h6) and other tags, then truncates the plain text.
 * @param {string} htmlString - The HTML content to process.
 * @param {number} maxLength - The maximum length of the plain text to return.
 * @returns {string} The processed and truncated plain text.
 */

export function getTruncatedPlainText(htmlString, maxLength = 200) {
  if (!htmlString) {
    return '';
  }
  const sanitizedHtml = DOMPurify.sanitize(htmlString, {
    USE_PROFILES: { html: true }, // Ensure basic HTML is allowed for initial parsing
  });

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitizedHtml;

  // 3. Remove header elements (h1-h6) from the temporary DOM
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img','pre', 'code'].forEach(tag => {
    const headers = tempDiv.querySelectorAll(tag);
    console.log("headers " ,headers);
    headers.forEach(header => header.remove());
  });

  let text = tempDiv.textContent || tempDiv.innerText || '';

  text = text.replace(/\s+/g, ' ').trim();

  // 6. Truncate the text
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }

  return text;
}


/**
 * Sanitize HTML from given raw HTML
 * @param {string} htmlString - The raw HTML content to sanitize.
 * @returns {string} The sanitized HTML.
 */
export function getSanitizedHTML(htmlString) {
  if (!htmlString) {
    return '';
  }

  // And ensure 'rel' is added for security when target="_blank"
  const sanitizedHtml = DOMPurify.sanitize(htmlString, {
    USE_PROFILES: { html: true }, // Ensure basic HTML is allowed for initial parsing
    ADD_ATTR: ['target'], // Explicitly allow the 'target' attribute

    // Use a hook to ensure 'rel="noopener noreferrer"' is always present
    // when target="_blank" is used on anchor tags.
    // This is the recommended secure way to handle it.
    hooks: {
      afterSanitizeAttributes: function (node) {
        // Check if the node is an anchor tag and has target="_blank"
        if (
          node.tagName === 'A' &&
          node.hasAttribute('target') &&
          node.getAttribute('target').toLowerCase() === '_blank'
        ) {
          // Get existing rel attribute value
          let rel = node.getAttribute('rel') || '';

          // Ensure noopener and noreferrer are present
          const requiredRel = ['noopener', 'noreferrer'];
          requiredRel.forEach(attr => {
            if (!rel.includes(attr)) {
              if (rel) {
                rel += ` ${attr}`; // Add with a space if rel already exists
              } else {
                rel = attr; // Set directly if rel is empty
              }
            }
          });

          node.setAttribute('rel', rel.trim()); // Apply the updated rel
        }
      },
    },
  });

  console.log("sanitizedhtml ")
  console.info(sanitizedHtml);
  console.log("end")
  return sanitizedHtml;
}