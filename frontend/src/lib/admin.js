// Helpers for the admin login token (saved in the browser)
const KEY = "wedding_admin_token"; // Name under which the token is saved
let memory = ""; // Backup if the browser blocks storage

// Reads the saved token
export function getToken() {
  try {
    return localStorage.getItem(KEY) || memory;
  } catch (e) {
    return memory;
  }
}

// Saves the token after a successful login
export function saveToken(token) {
  memory = token;
  try {
    localStorage.setItem(KEY, token);
  } catch (e) {
    // Storage blocked: the in-memory copy still works for this visit
  }
}

// Forgets the token (logout or expired login)
export function clearToken() {
  memory = "";
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // Nothing to do
  }
}

// fetch() that talks to Laravel and adds the admin token automatically
export function adminFetch(path, options = {}) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    cache: "no-store", // Never use a stale copy
    headers: {
      Accept: "application/json", // Ask for JSON
      Authorization: `Bearer ${getToken()}`, // Proves the admin is logged in
      ...(options.headers || {}), // Extra headers for a specific request
    },
  });
}